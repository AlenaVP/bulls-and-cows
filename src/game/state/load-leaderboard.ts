import { MIN_SECRET_LENGTH, SUPPORTED_BASES } from '../logic/constants.js';
import type { GameRecord } from '../types/game-record.js';

type StorageLike = Pick<Storage, 'getItem'>;

function isGameRecord(value: unknown): value is GameRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const settings = record['settings'];

  if (typeof settings !== 'object' || settings === null) {
    return false;
  }

  const gameSettings = settings as Record<string, unknown>;
  const { length, base } = gameSettings;

  return (
    typeof base === 'number' &&
    SUPPORTED_BASES.includes(base) &&
    typeof length === 'number' &&
    Number.isInteger(length) &&
    length >= MIN_SECRET_LENGTH &&
    length <= base &&
    typeof record['attempts'] === 'number' &&
    Number.isInteger(record['attempts']) &&
    record['attempts'] > 0 &&
    typeof record['duration'] === 'number' &&
    Number.isFinite(record['duration']) &&
    record['duration'] >= 0 &&
    typeof record['completedAt'] === 'number' &&
    Number.isFinite(record['completedAt']) &&
    record['completedAt'] >= 0
  );
}

export function loadLeaderboard(storage?: StorageLike): GameRecord[] {
  try {
    const targetStorage = storage ?? globalThis.localStorage;
    const storedData = targetStorage.getItem('bulls-and-cows-leaderboard');

    if (storedData === null) {
      return [];
    }

    const parsedData: unknown = JSON.parse(storedData);

    if (!Array.isArray(parsedData) || !parsedData.every(isGameRecord)) {
      return [];
    }

    return parsedData;
  } catch {
    return [];
  }
}
