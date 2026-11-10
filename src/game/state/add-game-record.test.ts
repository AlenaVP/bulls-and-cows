import { describe, expect, it, vi } from 'vitest';

import type { GameRecord } from '../types/game-record';
import { addGameRecord } from './add-game-record';

describe('addGameRecord', () => {
  const existingRecords: GameRecord[] = [
    {
      settings: { length: 5, base: 10 },
      attempts: 5,
      duration: 12000,
      completedAt: 1000,
    },
    {
      settings: { length: 5, base: 10 },
      attempts: 3,
      duration: 15000,
      completedAt: 2000,
    },
  ];

  const newRecord: GameRecord = {
    settings: { length: 5, base: 10 },
    attempts: 2,
    duration: 8000,
    completedAt: 3000,
  };

  it('adds a new record to the leaderboard', () => {
    const storage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify(existingRecords)),
      setItem: vi.fn(),
    };

    const result = addGameRecord(newRecord, storage);

    expect(result).toEqual([newRecord, existingRecords[1], existingRecords[0]]);
  });

  it('saves the updated leaderboard', () => {
    const storage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify(existingRecords)),
      setItem: vi.fn(),
    };

    const result = addGameRecord(newRecord, storage);

    expect(storage.setItem).toHaveBeenCalledWith('bulls-and-cows-leaderboard', JSON.stringify(result));
  });

  it('limits the result to the configured leaderboard size', () => {
    const records = Array.from({ length: 10 }, (_, index) => ({
      settings: { length: 5, base: 10 },
      attempts: index + 3,
      duration: 10000,
      completedAt: index,
    }));

    const storage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify(records)),
      setItem: vi.fn(),
    };

    const result = addGameRecord(newRecord, storage);

    expect(result).toHaveLength(10);
    expect(result[0]).toEqual(newRecord);
  });

  it('does not modify the original record', () => {
    const storage = {
      getItem: vi.fn().mockReturnValue(JSON.stringify(existingRecords)),
      setItem: vi.fn(),
    };
    const originalRecord = { ...newRecord, settings: { ...newRecord.settings } };

    addGameRecord(newRecord, storage);

    expect(newRecord).toEqual(originalRecord);
  });

  it('handles unavailable storage', () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error('Storage is unavailable');
      }),
      setItem: vi.fn(),
    };

    expect(addGameRecord(newRecord, storage)).toEqual([newRecord]);
    expect(storage.setItem).toHaveBeenCalled();
  });
});
