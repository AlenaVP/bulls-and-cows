import type { GameSettings } from './game-settings';

export interface GameRecord {
  settings: GameSettings;
  attempts: number;
  duration: number;
  completedAt: number;
}
