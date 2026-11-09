import { describe, expect, it, vi } from 'vitest';

import type { GameRecord } from '../types/game-record';
import { loadLeaderboard } from './load-leaderboard';

describe('loadLeaderboard', () => {
  const records: GameRecord[] = [
    {
      settings: { length: 5, base: 10 },
      attempts: 5,
      duration: 12000,
      completedAt: 1000,
    },
  ];

  it('loads records from localStorage', () => {
    const storage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify(records)),
    };

    expect(loadLeaderboard(storage)).toEqual(records);
    expect(storage.getItem).toHaveBeenCalledWith('bulls-and-cows-leaderboard');
  });

  it('returns an empty array when no records are stored', () => {
    const storage = {
      getItem: vi.fn().mockReturnValue(null),
    };

    expect(loadLeaderboard(storage)).toEqual([]);
  });

  it('returns an empty array when the stored leaderboard is empty', () => {
    const storage = {
      getItem: vi.fn().mockReturnValue('[]'),
    };

    expect(loadLeaderboard(storage)).toEqual([]);
  });

  it('returns an empty array when stored data contains invalid JSON', () => {
    const storage = {
      getItem: vi.fn().mockReturnValue('{invalid json'),
    };

    expect(loadLeaderboard(storage)).toEqual([]);
  });

  it('returns an empty array when stored data is not an array', () => {
    const storage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify({ records })),
    };

    expect(loadLeaderboard(storage)).toEqual([]);
  });

  it('returns an empty array when a record has an invalid structure', () => {
    const invalidRecords = [
      {
        settings: { length: 5, base: 10 },
        attempts: '5',
        duration: 12000,
        completedAt: 1000,
      },
    ];

    const storage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify(invalidRecords)),
    };

    expect(loadLeaderboard(storage)).toEqual([]);
  });

  it('returns an empty array when storage is unavailable', () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error('Storage is unavailable');
      }),
    };

    expect(loadLeaderboard(storage)).toEqual([]);
  });
});
