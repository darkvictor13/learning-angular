import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { GameSummaryComponent } from '../game-summary/game-summary';
import { MemoryBoardComponent } from '../memory-board/memory-board';
import {
  DIFFICULTIES,
  Difficulty,
  DifficultyId,
  GameStatus,
  MemoryCard,
} from '../models/memory-game.model';
import { GameTimerService } from '../services/game-timer.service';
import { MemoryDeckService } from '../services/memory-deck.service';

const CHECK_DELAY_MS = 850;

@Component({
  selector: 'app-memory-game',
  imports: [GameSummaryComponent, MemoryBoardComponent],
  templateUrl: './memory-game.html',
  styleUrl: './memory-game.css',
})
export class MemoryGameComponent implements OnDestroy {
  private readonly deckService = inject(MemoryDeckService);
  private readonly timer = inject(GameTimerService);

  readonly difficulties = DIFFICULTIES;
  readonly selectedDifficulty = signal<Difficulty>(DIFFICULTIES[0]);
  readonly cards = signal<MemoryCard[]>([]);
  readonly status = signal<GameStatus>('idle');
  readonly moves = signal(0);
  readonly matchedPairs = computed(() => this.cards().filter((card) => card.isMatched).length / 2);
  readonly elapsedSeconds = this.timer.elapsedSeconds;
  readonly formattedTime = computed(() => this.formatTime(this.elapsedSeconds()));
  readonly canChangeDifficulty = computed(() => this.status() === 'idle' || this.status() === 'won');
  readonly boardDisabled = computed(() => this.status() === 'checking' || this.status() === 'won');
  readonly progressLabel = computed(
    () => `${this.matchedPairs()} de ${this.selectedDifficulty().pairCount} pares encontrados`,
  );

  private checkTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.resetGame();
  }

  ngOnDestroy(): void {
    this.clearPendingCheck();
    this.timer.reset();
  }

  changeDifficulty(difficultyId: DifficultyId): void {
    if (!this.canChangeDifficulty()) {
      return;
    }

    const difficulty = this.difficulties.find((item) => item.id === difficultyId);

    if (!difficulty || difficulty.id === this.selectedDifficulty().id) {
      return;
    }

    this.selectedDifficulty.set(difficulty);
    this.resetGame();
  }

  selectCard(cardId: string): void {
    if (this.status() === 'checking' || this.status() === 'won') {
      return;
    }

    const selectedCard = this.cards().find((card) => card.id === cardId);

    if (!selectedCard || selectedCard.isMatched || selectedCard.isFaceUp) {
      return;
    }

    if (this.status() === 'idle') {
      this.status.set('playing');
      this.timer.start();
    }

    this.cards.update((cards) =>
      cards.map((card) => (card.id === cardId ? { ...card, isFaceUp: true } : card)),
    );

    const openCards = this.cards().filter((card) => card.isFaceUp && !card.isMatched);

    if (openCards.length === 2) {
      this.moves.update((moves) => moves + 1);
      this.resolveAttempt(openCards);
    }
  }

  resetGame(): void {
    this.clearPendingCheck();
    this.timer.reset();
    this.moves.set(0);
    this.status.set('idle');
    this.cards.set(this.deckService.createDeck(this.selectedDifficulty()));
  }

  private resolveAttempt(openCards: MemoryCard[]): void {
    const [firstCard, secondCard] = openCards;

    if (firstCard.pairId === secondCard.pairId) {
      this.cards.update((cards) =>
        cards.map((card) =>
          card.pairId === firstCard.pairId ? { ...card, isMatched: true, isFaceUp: true } : card,
        ),
      );
      this.finishIfWon();
      return;
    }

    this.status.set('checking');
    this.checkTimeoutId = setTimeout(() => {
      this.cards.update((cards) =>
        cards.map((card) =>
          card.id === firstCard.id || card.id === secondCard.id ? { ...card, isFaceUp: false } : card,
        ),
      );
      this.status.set('playing');
      this.checkTimeoutId = null;
    }, CHECK_DELAY_MS);
  }

  private finishIfWon(): void {
    if (this.cards().every((card) => card.isMatched)) {
      this.status.set('won');
      this.timer.stop();
    }
  }

  private clearPendingCheck(): void {
    if (this.checkTimeoutId === null) {
      return;
    }

    clearTimeout(this.checkTimeoutId);
    this.checkTimeoutId = null;
  }

  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
