import { describe, expect, it } from 'vitest';

import type { GameRecord } from '../types/game-record';
import { getLeaderboard } from './get-leaderboard';

describe('getLeaderboard', () => {
  const createRecord = (attempts: number, duration: number, completedAt: number): GameRecord => ({
    settings: { length: 5, base: 10 },
    attempts,
    duration,
    completedAt,
  });

  it('sorts records by attempts in ascending order', () => {
    const records = [createRecord(5, 10000, 1), createRecord(2, 20000, 2), createRecord(3, 15000, 3)];

    expect(getLeaderboard(records)).toEqual([records[1], records[2], records[0]]);
  });

  it('sorts records by duration when attempts are equal', () => {
    const records = [createRecord(3, 10000, 1), createRecord(3, 5000, 2), createRecord(3, 8000, 3)];

    expect(getLeaderboard(records)).toEqual([records[1], records[2], records[0]]);
  });

  it('preserves the original order when attempts and duration are equal', () => {
    const records = [createRecord(3, 5000, 1), createRecord(3, 5000, 2), createRecord(3, 5000, 3)];

    expect(getLeaderboard(records)).toEqual(records);
  });

  it('limits the leaderboard to the configured number of records', () => {
    const records = Array.from({ length: 12 }, (_, index) => createRecord(index + 1, 1000, index));

    expect(getLeaderboard(records)).toHaveLength(10);
    expect(getLeaderboard(records)).toEqual(records.slice(0, 10));
  });

  it('does not modify the original array', () => {
    const records = [createRecord(5, 10000, 1), createRecord(2, 20000, 2), createRecord(3, 15000, 3)];
    const originalRecords = [...records];

    getLeaderboard(records);

    expect(records).toEqual(originalRecords);
  });

  it('returns an empty array when there are no records', () => {
    expect(getLeaderboard([])).toEqual([]);
  });
});
