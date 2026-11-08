import type { GuessResult } from './guess-result';

export interface GuessHistoryEntry {
  guess: string;
  result: GuessResult;
  submittedAt: number;
}
