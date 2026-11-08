const DIGITS = '0123456789abcdef';
const SUPPORTED_BASES = [2, 8, 10, 16];

export function createDigitValidator(base: number): (char: string) => boolean {
  if (!Number.isInteger(base) || base < 2 || base > 16) {
    throw new RangeError('Base must be an integer between 2 and 16.');
  }

  if (!SUPPORTED_BASES.includes(base)) {
    throw new RangeError('Base must be one of: 2, 8, 10, 16.');
  }

  const validDigits = DIGITS.slice(0, base);

  return (char: string): boolean => char.length === 1 && validDigits.includes(char.toLowerCase());
}
