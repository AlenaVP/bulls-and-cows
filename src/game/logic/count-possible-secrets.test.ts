import { describe, expect, it } from 'vitest';

import { countPossibleSecrets } from './count-possible-secrets';

describe('countPossibleSecrets', () => {
  describe('possible secret count', () => {
    it('calculates the number of secrets for decimal base and length 4', () => {
      expect(countPossibleSecrets(4, 10)).toBe(5040);
    });

    it('calculates the number of secrets for binary base and length 2', () => {
      expect(countPossibleSecrets(2, 2)).toBe(2);
    });

    it('calculates the number of secrets for hexadecimal base and length 3', () => {
      expect(countPossibleSecrets(3, 16)).toBe(3360);
    });

    it('allows zero as the first digit when counting possible secrets', () => {
      expect(countPossibleSecrets(2, 10)).toBe(90);
    });
  });

  describe('invalid arguments', () => {
    it('throws an error when length is less than 2', () => {
      expect(() => countPossibleSecrets(1, 10)).toThrow(RangeError);
    });

    it('throws an error when length exceeds the base', () => {
      expect(() => countPossibleSecrets(3, 2)).toThrow(RangeError);
    });

    it('throws an error for an unsupported base', () => {
      expect(() => countPossibleSecrets(3, 3)).toThrow(RangeError);
    });
  });
});
