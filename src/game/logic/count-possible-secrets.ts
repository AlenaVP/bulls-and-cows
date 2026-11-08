import { MIN_SECRET_LENGTH, SUPPORTED_BASES } from './constants';

const memo = new Map<string, number>();

function countPermutations(remainingLength: number, availableDigits: number): number {
  if (remainingLength === 0) {
    return 1;
  }

  const cacheKey = `${remainingLength}:${availableDigits}`;
  const cachedResult = memo.get(cacheKey);

  if (cachedResult !== undefined) {
    return cachedResult;
  }

  const result = availableDigits * countPermutations(remainingLength - 1, availableDigits - 1);

  memo.set(cacheKey, result);

  return result;
}

export function countPossibleSecrets(length: number, base: number): number {
  if (!SUPPORTED_BASES.includes(base)) {
    throw new RangeError('Base must be one of: 2, 8, 10, 16.');
  }

  if (!Number.isInteger(length) || length < MIN_SECRET_LENGTH || length > base) {
    throw new RangeError('Length must be an integer between 2 and the selected base.');
  }

  return countPermutations(length, base);
}
