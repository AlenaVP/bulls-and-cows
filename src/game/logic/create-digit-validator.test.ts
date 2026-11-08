import { describe, expect, it } from 'vitest';

import { createDigitValidator } from './create-digit-validator';

describe('createDigitValidator', () => {
  it('throws an error for an unsupported base', () => {
    expect(() => createDigitValidator(3)).toThrow(RangeError);
  });

  describe('binary (base 2)', () => {
    const isValidDigit = createDigitValidator(2);

    it.each(['0', '1'])('accepts valid digit "%s"', (char) => {
      expect(isValidDigit(char)).toBe(true);
    });

    it.each(['2', '9', 'A', ''])('rejects invalid digit "%s"', (char) => {
      expect(isValidDigit(char)).toBe(false);
    });
  });

  describe('octal (base 8)', () => {
    const isValidDigit = createDigitValidator(8);

    it.each(['0', '3', '7'])('accepts valid digit "%s"', (char) => {
      expect(isValidDigit(char)).toBe(true);
    });

    it.each(['8', '9', 'A', ''])('rejects invalid digit "%s"', (char) => {
      expect(isValidDigit(char)).toBe(false);
    });
  });

  describe('decimal (base 10)', () => {
    const isValidDigit = createDigitValidator(10);

    it.each(['0', '5', '9'])('accepts valid digit "%s"', (char) => {
      expect(isValidDigit(char)).toBe(true);
    });

    it.each(['A', 'F', '10', ''])('rejects invalid digit "%s"', (char) => {
      expect(isValidDigit(char)).toBe(false);
    });
  });

  describe('hexadecimal (base 16)', () => {
    const isValidDigit = createDigitValidator(16);

    it.each(['0', '9', 'A', 'F', 'a', 'f'])('accepts valid digit "%s"', (char) => {
      expect(isValidDigit(char)).toBe(true);
    });

    it.each(['G', 'g', 'Z', '10', ''])('rejects invalid digit "%s"', (char) => {
      expect(isValidDigit(char)).toBe(false);
    });
  });

  describe('invalid bases', () => {
    it.each([1, 0, -2, 17, 2.5, NaN])('throws an error for base %s', (base) => {
      expect(() => createDigitValidator(base)).toThrow(RangeError);
    });
  });

  describe('input validation', () => {
    const isValidDigit = createDigitValidator(16);

    it('rejects strings containing more than one character', () => {
      expect(isValidDigit('AF')).toBe(false);
    });

    it('rejects whitespace', () => {
      expect(isValidDigit(' ')).toBe(false);
      expect(isValidDigit('\n')).toBe(false);
    });
  });
});
