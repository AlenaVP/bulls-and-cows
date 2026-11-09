import { LEADERBOARD_LIMIT } from '../logic/constants';
import type { GameRecord } from '../types/game-record';

export function getLeaderboard(records: GameRecord[]): GameRecord[] {
  return [...records].sort((a, b) => a.attempts - b.attempts || a.duration - b.duration).slice(0, LEADERBOARD_LIMIT);
}
