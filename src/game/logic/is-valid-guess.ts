import { createDigitValidator } from './create-digit-validator';

export function isValidGuess(guess: string, length: number, base: number): boolean {
  if (guess.length !== length) {
    return false;
  }

  const isValidDigit = createDigitValidator(base);
  const digits = guess.toLowerCase().split('');

  return digits.every(isValidDigit) && new Set(digits).size === length;
}
