import type { Iso8601 } from '../nominal-types.js';

export interface Bond<Currency extends number = number> {
  name: string;
  amount: Currency;
  purchasePrice: Currency;
  purchaseDate: Iso8601;
  maturityDate: Iso8601;
  coupons: Array<{
    date: Iso8601;
    amount: Currency;
  }>;
}

export interface BondsGain {
  year: number;
  maturityGain: number;
  couponGain: number;
}

export interface Bonds<Currency extends number = number> {
  totalAmount: Currency;
  totalPurchasePrice: Currency;
  list: Bond<Currency>[];
  gain: BondsGain[];
}
