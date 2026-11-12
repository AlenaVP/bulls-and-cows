import { LEADERBOARD_STORAGE_KEY } from '../logic/constants.js';
import type { GameRecord } from '../types/game-record.js';

type StorageLike = Pick<Storage, 'setItem'>;

export function saveLeaderboard(records: GameRecord[], storage?: StorageLike): boolean {
  try {
    const targetStorage = storage ?? globalThis.localStorage;

    targetStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(records));

    return true;
  } catch {
    return false;
  }
}
