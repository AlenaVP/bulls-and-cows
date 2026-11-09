import { getGameDuration } from './get-game-duration';
import type { GameRecord } from '../types/game-record';
import type { GameState } from '../types/game-state';

export function createGameRecord(state: GameState): GameRecord | null {
  if (state.status !== 'won' || state.finishedAt === null) {
    return null;
  }

  return {
    settings: { ...state.settings },
    attempts: state.history.length,
    duration: getGameDuration(state),
    completedAt: state.finishedAt,
  };
}
