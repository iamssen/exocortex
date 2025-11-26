import type { Iso8601, Percent } from '../nominal-types.js';

export interface Deposit<Currency extends number = number> {
  name: string;
  amount: Currency;
  start: Iso8601;
  end: Iso8601;
  interest: Percent;
  tax: Percent;
  interestIncome: Currency;
}

export interface DepositsGain {
  year: number;
  interestGain: number;
}

export interface Deposits<Currency extends number = number> {
  totalAmount: Currency;
  list: Deposit<Currency>[];
  gain: DepositsGain[];
}
