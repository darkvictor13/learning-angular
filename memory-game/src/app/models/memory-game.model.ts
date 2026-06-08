export type GameStatus = 'idle' | 'playing' | 'checking' | 'won';

export type DifficultyId = 'easy' | 'medium' | 'hard';

export interface MemoryCard {
  id: string;
  pairId: string;
  label: string;
  isFaceUp: boolean;
  isMatched: boolean;
}

export interface Difficulty {
  id: DifficultyId;
  label: string;
  pairCount: number;
  columns: number;
}

export const DIFFICULTIES: readonly Difficulty[] = [
  { id: 'easy', label: 'Facil', pairCount: 6, columns: 4 },
  { id: 'medium', label: 'Medio', pairCount: 8, columns: 4 },
  { id: 'hard', label: 'Dificil', pairCount: 12, columns: 6 },
] as const;
