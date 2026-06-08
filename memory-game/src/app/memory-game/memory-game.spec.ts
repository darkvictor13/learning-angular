import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { MemoryGameComponent } from './memory-game';

describe('MemoryGameComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemoryGameComponent],
    }).compileComponents();
  });

  it('starts with an easy shuffled deck', () => {
    const fixture = TestBed.createComponent(MemoryGameComponent);
    const component = fixture.componentInstance;

    expect(component.selectedDifficulty().id).toBe('easy');
    expect(component.cards()).toHaveLength(12);
    expect(component.moves()).toBe(0);
    expect(component.status()).toBe('idle');
  });

  it('flips a selected card and starts the timer state', () => {
    const fixture = TestBed.createComponent(MemoryGameComponent);
    const component = fixture.componentInstance;
    const card = component.cards()[0];

    component.selectCard(card.id);

    expect(component.cards().find((item) => item.id === card.id)?.isFaceUp).toBe(true);
    expect(component.status()).toBe('playing');
  });

  it('keeps matching cards face up and increments moves once', () => {
    const fixture = TestBed.createComponent(MemoryGameComponent);
    const component = fixture.componentInstance;
    const [firstCard, secondCard] = findMatchingCards(component.cards());

    component.selectCard(firstCard.id);
    component.selectCard(secondCard.id);

    const matchedCards = component.cards().filter((card) => card.pairId === firstCard.pairId);

    expect(component.moves()).toBe(1);
    expect(matchedCards.every((card) => card.isFaceUp && card.isMatched)).toBe(true);
    expect(component.status()).toBe('playing');
  });

  it('hides different cards after validation delay', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(MemoryGameComponent);
    const component = fixture.componentInstance;
    const [firstCard, secondCard] = findDifferentCards(component.cards());

    component.selectCard(firstCard.id);
    component.selectCard(secondCard.id);

    expect(component.moves()).toBe(1);
    expect(component.status()).toBe('checking');

    vi.advanceTimersByTime(850);

    const checkedCards = component
      .cards()
      .filter((card) => card.id === firstCard.id || card.id === secondCard.id);

    expect(checkedCards.every((card) => !card.isFaceUp && !card.isMatched)).toBe(true);
    expect(component.status()).toBe('playing');
    fixture.destroy();
    vi.useRealTimers();
  });

  it('prevents selecting the same card twice in one attempt', () => {
    const fixture = TestBed.createComponent(MemoryGameComponent);
    const component = fixture.componentInstance;
    const card = component.cards()[0];

    component.selectCard(card.id);
    component.selectCard(card.id);

    expect(component.moves()).toBe(0);
    expect(component.cards().filter((item) => item.isFaceUp)).toHaveLength(1);
  });

  it('detects victory when every pair is found', () => {
    const fixture = TestBed.createComponent(MemoryGameComponent);
    const component = fixture.componentInstance;
    const pairIds = [...new Set(component.cards().map((card) => card.pairId))];

    for (const pairId of pairIds) {
      const [firstCard, secondCard] = component.cards().filter((card) => card.pairId === pairId);
      component.selectCard(firstCard.id);
      component.selectCard(secondCard.id);
    }

    expect(component.status()).toBe('won');
    expect(component.matchedPairs()).toBe(component.selectedDifficulty().pairCount);
  });

  it('resets previous state and creates a new playable deck', () => {
    const fixture = TestBed.createComponent(MemoryGameComponent);
    const component = fixture.componentInstance;
    const card = component.cards()[0];

    component.selectCard(card.id);
    component.resetGame();

    expect(component.status()).toBe('idle');
    expect(component.moves()).toBe(0);
    expect(component.elapsedSeconds()).toBe(0);
    expect(component.cards()).toHaveLength(12);
    expect(component.cards().every((item) => !item.isFaceUp && !item.isMatched)).toBe(true);
  });

  it('changes difficulty only when the game is not in progress', () => {
    const fixture = TestBed.createComponent(MemoryGameComponent);
    const component = fixture.componentInstance;

    component.changeDifficulty('medium');
    expect(component.cards()).toHaveLength(16);

    component.selectCard(component.cards()[0].id);
    component.changeDifficulty('hard');

    expect(component.selectedDifficulty().id).toBe('medium');
    expect(component.cards()).toHaveLength(16);
  });

  it('renders cards as keyboard-focusable buttons', async () => {
    const fixture = TestBed.createComponent(MemoryGameComponent);
    await fixture.whenStable();

    const buttons = fixture.nativeElement.querySelectorAll('app-memory-card button') as NodeListOf<HTMLButtonElement>;

    expect(buttons.length).toBe(12);
    expect(buttons[0].type).toBe('button');
    expect(buttons[0].getAttribute('aria-label')).toBe('Carta oculta');
  });
});

function findMatchingCards(cards: ReturnType<MemoryGameComponent['cards']>) {
  const firstCard = cards[0];
  const secondCard = cards.find((card) => card.pairId === firstCard.pairId && card.id !== firstCard.id);

  if (!secondCard) {
    throw new Error('Expected a matching card');
  }

  return [firstCard, secondCard] as const;
}

function findDifferentCards(cards: ReturnType<MemoryGameComponent['cards']>) {
  const firstCard = cards[0];
  const secondCard = cards.find((card) => card.pairId !== firstCard.pairId);

  if (!secondCard) {
    throw new Error('Expected a different card');
  }

  return [firstCard, secondCard] as const;
}
