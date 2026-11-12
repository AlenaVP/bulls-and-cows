import { describe, expect, it } from 'vitest';

import { generateSecret } from './generate-secret';

describe('generateSecret', () => {
  describe('secret generation', () => {
    it('generates a secret with the requested length', () => {
      expect(generateSecret(4, 10, () => 0.1)).toHaveLength(4);
    });

    it('generates unique digits', () => {
      const secret = generateSecret(4, 10, () => 0.1);

      expect(new Set(secret).size).toBe(secret.length);
    });

    it('allows zero as the first digit', () => {
      expect(generateSecret(4, 10, () => 0)).toBe('0123');
    });

    it('generates digits within the selected base', () => {
      const secret = generateSecret(4, 8, () => 0.5);

      expect([...secret].every((digit) => '01234567'.includes(digit))).toBe(true);
    });
  });

  describe('numeral systems', () => {
    it('generates binary secrets', () => {
      expect(generateSecret(2, 2, () => 0)).toBe('01');
    });

    it('generates hexadecimal secrets in lowercase', () => {
      expect(generateSecret(4, 16, () => 0)).toBe('0123');
    });
  });

  describe('random source', () => {
    it('uses the injected random function for deterministic results', () => {
      const randomValues = [0, 0.2, 0.4, 0.6];
      let index = 0;

      const random = (): number => randomValues[index++] ?? 0;

      expect(generateSecret(4, 10, random)).toBe('0257');
    });
  });

  describe('invalid arguments', () => {
    it('throws an error when length is less than 2', () => {
      expect(() => generateSecret(1, 10)).toThrow(RangeError);
    });

    it('throws an error when length exceeds the base', () => {
      expect(() => generateSecret(4, 2)).toThrow(RangeError);
    });

    it('throws an error for an unsupported base', () => {
      expect(() => generateSecret(3, 3)).toThrow(RangeError);
    });
  });
});
