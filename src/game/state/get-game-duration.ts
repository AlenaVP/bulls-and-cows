import type { GameState } from '../types/game-state.js';

export function getGameDuration(state: GameState): number {
  const endTime = state.finishedAt ?? Date.now();

  return endTime - state.startedAt;
}
