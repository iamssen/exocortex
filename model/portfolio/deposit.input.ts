import type { Deposit } from './deposit.ts';

export type DepositInput<Currency extends number = number> = Omit<
  Deposit<Currency>,
  'interestIncome'
>[];
