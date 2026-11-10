import { describe, expect, it, vi } from 'vitest';

import type { GameRecord } from '../types/game-record';
import { addGameRecord } from './add-game-record';
import { loadLeaderboard } from './load-leaderboard';

describe('leaderboard integration', () => {
  it('saves and loads the updated leaderboard', () => {
    const data = new Map<string, string>();

    const storage = {
      getItem: vi.fn((key: string) => data.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => data.set(key, value)),
    };

    const firstRecord: GameRecord = {
      settings: { length: 5, base: 10 },
      attempts: 5,
      duration: 12000,
      completedAt: 1000,
    };

    const secondRecord: GameRecord = {
      settings: { length: 5, base: 10 },
      attempts: 2,
      duration: 8000,
      completedAt: 2000,
    };

    addGameRecord(firstRecord, storage);
    const updatedLeaderboard = addGameRecord(secondRecord, storage);

    expect(updatedLeaderboard).toEqual([secondRecord, firstRecord]);
    expect(loadLeaderboard(storage)).toEqual([secondRecord, firstRecord]);
  });
});
