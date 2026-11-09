import { describe, expect, it, vi } from 'vitest';

import { createGame } from './create-game';
import { getGameDuration } from './get-game-duration';
import { submitGuess } from './submit-guess';

describe('getGameDuration', () => {
  it('returns the elapsed time for a game in progress', () => {
    const game = createGame(
      { length: 5, base: 10 },
      () => 0,
      () => 1000,
    );

    vi.spyOn(Date, 'now').mockReturnValue(5000);

    expect(getGameDuration(game)).toBe(4000);

    vi.restoreAllMocks();
  });

  it('returns the final duration for a won game', () => {
    const game = createGame(
      { length: 5, base: 10 },
      () => 0,
      () => 1000,
    );
    const wonGame = submitGuess(game, '01234', () => 3000);

    expect(getGameDuration(wonGame)).toBe(2000);
  });

  it('returns zero when the game has just started', () => {
    const game = createGame(
      { length: 5, base: 10 },
      () => 0,
      () => 1000,
    );

    vi.spyOn(Date, 'now').mockReturnValue(1000);

    expect(getGameDuration(game)).toBe(0);

    vi.restoreAllMocks();
  });

  it('does not modify the game state', () => {
    const game = createGame(
      { length: 5, base: 10 },
      () => 0,
      () => 1000,
    );
    const originalState = { ...game };

    vi.spyOn(Date, 'now').mockReturnValue(5000);

    getGameDuration(game);

    expect(game).toEqual(originalState);

    vi.restoreAllMocks();
  });
});
