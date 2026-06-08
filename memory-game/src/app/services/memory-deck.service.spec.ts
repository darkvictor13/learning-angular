import { TestBed } from '@angular/core/testing';
import { DIFFICULTIES } from '../models/memory-game.model';
import { MemoryDeckService } from './memory-deck.service';

describe('MemoryDeckService', () => {
  let service: MemoryDeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoryDeckService);
  });

  it('creates a deck with correct pairs for each difficulty', () => {
    for (const difficulty of DIFFICULTIES) {
      const deck = service.createDeck(difficulty);
      const pairCounts = new Map<string, number>();

      for (const card of deck) {
        pairCounts.set(card.pairId, (pairCounts.get(card.pairId) ?? 0) + 1);
      }

      expect(deck).toHaveLength(difficulty.pairCount * 2);
      expect(pairCounts.size).toBe(difficulty.pairCount);
      expect([...pairCounts.values()]).toEqual(Array(difficulty.pairCount).fill(2));
    }
  });

  it('shuffles without changing the pair distribution', () => {
    const difficulty = DIFFICULTIES[2];
    const deck = service.createDeck(difficulty);
    const shuffled = service.shuffle(deck);

    const originalLabels = deck.map((card) => card.label).sort();
    const shuffledLabels = shuffled.map((card) => card.label).sort();

    expect(shuffled).not.toBe(deck);
    expect(shuffled).toHaveLength(deck.length);
    expect(shuffledLabels).toEqual(originalLabels);
  });
});
