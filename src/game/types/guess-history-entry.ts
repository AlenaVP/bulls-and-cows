import type { GuessResult } from './guess-result.js';

export interface GuessHistoryEntry {
  guess: string;
  result: GuessResult;
  submittedAt: number;
}
