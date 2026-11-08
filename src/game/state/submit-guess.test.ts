import { describe, expect, it } from 'vitest';

import { createGame } from './create-game';
import { submitGuess } from './submit-guess';

describe('submitGuess', () => {
  const createTestGame = () =>
    createGame(
      { length: 5, base: 10 },
      () => 0,
      () => 1000,
    );

  it('adds a valid guess to the history', () => {
    const game = createTestGame();

    const updatedGame = submitGuess(game, '56789', () => 2000);

    expect(updatedGame.history).toHaveLength(1);
    expect(updatedGame.history[0]).toEqual({
      guess: '56789',
      result: { bulls: 0, cows: 0 },
      submittedAt: 2000,
    });
  });

  it('keeps the game in playing status when the guess is incorrect', () => {
    const game = createTestGame();

    const updatedGame = submitGuess(game, '56789', () => 2000);

    expect(updatedGame.status).toBe('playing');
    expect(updatedGame.finishedAt).toBeNull();
  });

  it('marks the game as won when the guess matches the secret', () => {
    const game = createTestGame();

    const updatedGame = submitGuess(game, '01234', () => 2000);

    expect(updatedGame.status).toBe('won');
    expect(updatedGame.finishedAt).toBe(2000);
  });

  it('does not add a duplicate guess to the history', () => {
    const game = createTestGame();
    const updatedGame = submitGuess(game, '56789', () => 2000);

    const result = submitGuess(updatedGame, '56789', () => 3000);

    expect(result).toBe(updatedGame);
    expect(result.history).toHaveLength(1);
  });

  it('compares hexadecimal guesses case-insensitively when checking duplicates', () => {
    const game = createGame({ length: 3, base: 16 }, () => 0);
    const updatedGame = submitGuess(game, 'a1f', () => 2000);

    const result = submitGuess(updatedGame, 'A1F', () => 3000);

    expect(result).toBe(updatedGame);
    expect(result.history).toHaveLength(1);
  });

  it('does not change the original game state', () => {
    const game = createTestGame();
    const originalHistory = game.history;

    const updatedGame = submitGuess(game, '56789', () => 2000);

    expect(game.history).toBe(originalHistory);
    expect(game.history).toHaveLength(0);
    expect(updatedGame.history).not.toBe(originalHistory);
  });

  it('does not accept invalid guesses', () => {
    const game = createTestGame();

    const result = submitGuess(game, '1123');

    expect(result).toBe(game);
    expect(result.history).toHaveLength(0);
  });

  it('does not accept guesses after the game is won', () => {
    const game = createTestGame();
    const wonGame = submitGuess(game, '01234', () => 2000);

    const result = submitGuess(wonGame, '56789', () => 3000);

    expect(result).toBe(wonGame);
    expect(result.history).toHaveLength(1);
    expect(result.finishedAt).toBe(2000);
  });
});
