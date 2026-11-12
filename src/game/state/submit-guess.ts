import { evaluateGuess } from '../logic/evaluate-guess.js';
import { isValidGuess } from '../logic/is-valid-guess.js';
import type { GameState } from '../types/game-state.js';

export function submitGuess(state: GameState, guess: string, clock: () => number = Date.now): GameState {
  if (state.status === 'won' || !isValidGuess(guess, state.settings.length, state.settings.base)) {
    return state;
  }

  const normalizedGuess = guess.toLowerCase();

  const isDuplicate = state.history.some((entry) => entry.guess.toLowerCase() === normalizedGuess);

  if (isDuplicate) {
    return state;
  }

  const result = evaluateGuess(state.secret, guess);
  const submittedAt = clock();
  const isWon = result.bulls === state.settings.length;

  return {
    ...state,
    history: [...state.history, { guess: normalizedGuess, result, submittedAt }],
    status: isWon ? 'won' : 'playing',
    finishedAt: isWon ? submittedAt : null,
  };
}
