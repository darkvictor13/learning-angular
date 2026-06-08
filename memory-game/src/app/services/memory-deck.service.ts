import { Injectable } from '@angular/core';
import { Difficulty, MemoryCard } from '../models/memory-game.model';

const CARD_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

@Injectable({
  providedIn: 'root',
})
export class MemoryDeckService {
  createDeck(difficulty: Difficulty): MemoryCard[] {
    const cards = CARD_LABELS.slice(0, difficulty.pairCount).flatMap((label, pairIndex) => {
      const pairId = `pair-${label}`;

      return [0, 1].map((copyIndex) => ({
        id: `${pairId}-${copyIndex}-${pairIndex}`,
        pairId,
        label,
        isFaceUp: false,
        isMatched: false,
      }));
    });

    return this.shuffle(cards);
  }

  shuffle(cards: MemoryCard[]): MemoryCard[] {
    const shuffled = [...cards];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
  }
}
