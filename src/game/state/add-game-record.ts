import type { GameRecord } from '../types/game-record.js';
import { getLeaderboard } from './get-leaderboard.js';
import { loadLeaderboard } from './load-leaderboard.js';
import { saveLeaderboard } from './save-leaderboard.js';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function addGameRecord(record: GameRecord, storage?: StorageLike): GameRecord[] {
  const existingRecords = loadLeaderboard(storage);
  const updatedRecords = getLeaderboard([...existingRecords, record]);

  saveLeaderboard(updatedRecords, storage);

  return updatedRecords;
}
