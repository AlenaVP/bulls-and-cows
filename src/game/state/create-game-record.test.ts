import { describe, expect, it } from 'vitest';

import { createGame } from './create-game';
import { createGameRecord } from './create-game-record';
import { submitGuess } from './submit-guess';

describe('createGameRecord', () => {
  it('returns null for a game in progress', () => {
    const game = createGame(
      { length: 5, base: 10 },
      () => 0,
      () => 1000,
    );

    expect(createGameRecord(game)).toBeNull();
  });

  it('creates a record for a won game', () => {
    const game = createGame(
      { length: 5, base: 10 },
      () => 0,
      () => 1000,
    );
    const gameWithGuesses = submitGuess(game, '56789', () => 2000);
    const wonGame = submitGuess(gameWithGuesses, '01234', () => 5000);

    expect(createGameRecord(wonGame)).toEqual({
      settings: { length: 5, base: 10 },
      attempts: 2,
      duration: 4000,
      completedAt: 5000,
    });
  });

  it('does not include the secret in the record', () => {
    const game = createGame(
      { length: 5, base: 10 },
      () => 0,
      () => 1000,
    );
    const wonGame = submitGuess(game, '01234', () => 3000);

    const record = createGameRecord(wonGame);

    expect(record).not.toHaveProperty('secret');
  });

  it('does not modify the original game state', () => {
    const game = createGame(
      { length: 5, base: 10 },
      () => 0,
      () => 1000,
    );
    const wonGame = submitGuess(game, '01234', () => 3000);
    const originalState = { ...wonGame };

    createGameRecord(wonGame);

    expect(wonGame).toEqual(originalState);
  });
});
