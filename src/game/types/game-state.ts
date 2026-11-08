import type { GameSettings } from './game-settings';
import type { GuessHistoryEntry } from './guess-history-entry';

export type GameStatus = 'playing' | 'won';

export interface GameState {
  settings: GameSettings;
  secret: string;
  history: GuessHistoryEntry[];
  status: GameStatus;
  startedAt: number;
  finishedAt: number | null;
}
