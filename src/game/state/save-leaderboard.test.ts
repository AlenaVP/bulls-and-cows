import { describe, expect, it, vi } from 'vitest';

import type { GameRecord } from '../types/game-record';
import { saveLeaderboard } from './save-leaderboard';

describe('saveLeaderboard', () => {
  const records: GameRecord[] = [
    {
      settings: { length: 5, base: 10 },
      attempts: 5,
      duration: 12000,
      completedAt: 1000,
    },
  ];

  it('saves records to localStorage as JSON', () => {
    const storage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
    };

    saveLeaderboard(records, storage);

    expect(storage.setItem).toHaveBeenCalledWith('bulls-and-cows-leaderboard', JSON.stringify(records));
  });

  it('does not modify the original records', () => {
    const storage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
    };
    const originalRecords = [...records];

    saveLeaderboard(records, storage);

    expect(records).toEqual(originalRecords);
  });

  it('saves an empty leaderboard', () => {
    const storage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
    };

    saveLeaderboard([], storage);

    expect(storage.setItem).toHaveBeenCalledWith('bulls-and-cows-leaderboard', '[]');
  });

  it('returns false when storage is unavailable', () => {
    const storage = {
      setItem: vi.fn(() => {
        throw new Error('Storage is unavailable');
      }),
      getItem: vi.fn(),
    };

    expect(saveLeaderboard(records, storage)).toBe(false);
  });

  it('returns true when records are saved successfully', () => {
    const storage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
    };

    expect(saveLeaderboard(records, storage)).toBe(true);
  });
});
