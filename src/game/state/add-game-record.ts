import type { GameRecord } from '../types/game-record';
import { getLeaderboard } from './get-leaderboard';
import { loadLeaderboard } from './load-leaderboard';
import { saveLeaderboard } from './save-leaderboard';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function addGameRecord(record: GameRecord, storage?: StorageLike): GameRecord[] {
  const existingRecords = loadLeaderboard(storage);
  const updatedRecords = getLeaderboard([...existingRecords, record]);

  saveLeaderboard(updatedRecords, storage);

  return updatedRecords;
}
