import { describe, expect, it } from 'vitest';

import { isValidGuess } from './is-valid-guess';

describe('isValidGuess', () => {
  describe('valid guesses', () => {
    it('accepts a guess with the correct length and unique digits', () => {
      expect(isValidGuess('1234', 4, 10)).toBe(true);
    });

    it('accepts zero as the first digit', () => {
      expect(isValidGuess('0123', 4, 10)).toBe(true);
    });

    it('accepts lowercase hexadecimal digits', () => {
      expect(isValidGuess('a1f', 3, 16)).toBe(true);
    });
  });

  describe('invalid guesses', () => {
    it('rejects a guess with an incorrect length', () => {
      expect(isValidGuess('123', 4, 10)).toBe(false);
    });

    it('rejects repeated digits', () => {
      expect(isValidGuess('1123', 4, 10)).toBe(false);
    });

    it('rejects digits outside the selected base', () => {
      expect(isValidGuess('1283', 4, 8)).toBe(false);
    });

    it('rejects an empty guess', () => {
      expect(isValidGuess('', 4, 10)).toBe(false);
    });
  });
});
