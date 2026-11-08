import { generateSecret } from '../logic/generate-secret';
import type { GameSettings } from '../types/game-settings';
import type { GameState } from '../types/game-state';

export function createGame(
  settings: GameSettings,
  random: () => number = Math.random,
  clock: () => number = Date.now,
): GameState {
  return {
    settings: { ...settings },
    secret: generateSecret(settings.length, settings.base, random),
    history: [],
    status: 'playing',
    startedAt: clock(),
    finishedAt: null,
  };
}
