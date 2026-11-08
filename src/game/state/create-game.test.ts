import { describe, expect, it } from 'vitest';

import { createGame } from './create-game';

describe('createGame', () => {
  it('creates a game with the provided settings', () => {
    const game = createGame({ length: 5, base: 10 });

    expect(game.settings).toEqual({ length: 5, base: 10 });
  });

  it('generates a secret with the requested length and base', () => {
    const game = createGame({ length: 5, base: 10 });

    expect(game.secret).toHaveLength(5);
    expect([...game.secret].every((digit) => '0123456789'.includes(digit))).toBe(true);
    expect(new Set(game.secret).size).toBe(5);
  });

  it('initializes an empty guess history', () => {
    const game = createGame({ length: 5, base: 10 });

    expect(game.history).toEqual([]);
  });

  it('initializes the game with playing status', () => {
    const game = createGame({ length: 5, base: 10 });

    expect(game.status).toBe('playing');
  });

  it('sets the start time', () => {
    const game = createGame({ length: 5, base: 10 });

    expect(game.startedAt).toEqual(expect.any(Number));
  });

  it('sets the finish time to null', () => {
    const game = createGame({ length: 5, base: 10 });

    expect(game.finishedAt).toBeNull();
  });

  it('uses the injected random function for deterministic secret generation', () => {
    const game = createGame({ length: 5, base: 10 }, () => 0);

    expect(game.secret).toBe('01234');
  });

  it('uses the injected clock for deterministic start time', () => {
    const game = createGame({ length: 5, base: 10 }, Math.random, () => 123456789);

    expect(game.startedAt).toBe(123456789);
  });

  it('creates independent game states', () => {
    const firstGame = createGame({ length: 5, base: 10 }, () => 0);
    const secondGame = createGame({ length: 5, base: 10 }, () => 0);

    expect(firstGame).not.toBe(secondGame);
    expect(firstGame.history).not.toBe(secondGame.history);
  });
});
