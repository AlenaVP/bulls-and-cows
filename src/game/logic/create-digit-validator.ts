import { DIGITS, MAX_BASE, MIN_BASE, SUPPORTED_BASES } from './constants.js';

export function createDigitValidator(base: number): (char: string) => boolean {
  if (!Number.isInteger(base) || base < MIN_BASE || base > MAX_BASE) {
    throw new RangeError('Base must be an integer between 2 and 16.');
  }

  if (!SUPPORTED_BASES.includes(base)) {
    throw new RangeError('Base must be one of: 2, 8, 10, 16.');
  }

  const validDigits = DIGITS.slice(0, base);

  return (char: string): boolean => char.length === 1 && validDigits.includes(char.toLowerCase());
}
