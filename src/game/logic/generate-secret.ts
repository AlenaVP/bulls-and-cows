import { DIGITS, MIN_SECRET_LENGTH, SUPPORTED_BASES } from './constants.js';

export function generateSecret(length: number, base: number, random: () => number = Math.random): string {
  if (!SUPPORTED_BASES.includes(base)) {
    throw new RangeError('Base must be one of: 2, 8, 10, 16.');
  }

  if (!Number.isInteger(length) || length < MIN_SECRET_LENGTH || length > base) {
    throw new RangeError('Length must be an integer between 2 and the selected base.');
  }

  const availableDigits = DIGITS.slice(0, base).split('');

  return Array.from({ length }, () => {
    const randomValue = random();

    if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
      throw new RangeError('Random function must return a value between 0 (inclusive) and 1 (exclusive).');
    }

    const randomIndex = Math.floor(randomValue * availableDigits.length);

    if (randomIndex < 0 || randomIndex >= availableDigits.length) {
      throw new RangeError('Random function must return a value between 0 (inclusive) and 1 (exclusive).');
    }

    return availableDigits.splice(randomIndex, 1)[0];
  }).join('');
}
