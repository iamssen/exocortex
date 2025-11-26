import type { Deposit } from './deposit.js';

export type DepositInput<Currency extends number = number> = Omit<
  Deposit<Currency>,
  'interestIncome'
>[];
