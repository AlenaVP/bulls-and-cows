import { describe, expect, it } from 'vitest';

import { evaluateGuess } from './evaluate-guess';

describe('evaluateGuess', () => {
  describe('bulls and cows calculation', () => {
    it('returns the number of bulls when all digits are in the correct positions', () => {
      expect(evaluateGuess('1234', '1234')).toEqual({
        bulls: 4,
        cows: 0,
      });
    });

    it('returns the number of cows when all digits are in incorrect positions', () => {
      expect(evaluateGuess('1234', '4321')).toEqual({
        bulls: 0,
        cows: 4,
      });
    });

    it('returns the correct number of bulls and cows for a mixed result', () => {
      expect(evaluateGuess('4271', '1234')).toEqual({
        bulls: 1,
        cows: 2,
      });
    });

    it('returns zero bulls and cows when there are no matching digits', () => {
      expect(evaluateGuess('1234', '5678')).toEqual({
        bulls: 0,
        cows: 0,
      });
    });
  });

  describe('hexadecimal comparison', () => {
    it('compares hexadecimal digits case-insensitively', () => {
      expect(evaluateGuess('a1f', 'F1A')).toEqual({
        bulls: 1,
        cows: 2,
      });
    });
  });
});
