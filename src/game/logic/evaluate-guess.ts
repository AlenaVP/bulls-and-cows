import type { GuessResult } from '../types/guess-result';

export function evaluateGuess(secret: string, guess: string): GuessResult {
  const normalizedSecret = secret.toLowerCase().split('');
  const normalizedGuess = guess.toLowerCase().split('');

  const bulls = normalizedGuess.map((digit, index) => digit === normalizedSecret[index]).filter(Boolean).length;

  const cows = normalizedGuess
    .filter((digit, index) => digit !== normalizedSecret[index] && normalizedSecret.includes(digit))
    .reduce((count) => count + 1, 0);

  return { bulls, cows };
}
