import type { GameSettings } from './game-settings.js';

export interface GameRecord {
  settings: GameSettings;
  attempts: number;
  duration: number;
  completedAt: number;
}
