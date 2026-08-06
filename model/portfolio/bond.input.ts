import type { Iso8601 } from '../nominal-types.ts';

export type BondInput<Currency extends number> = Array<{
  name: string;
  amount: Currency;
  purchase_price: Currency;
  purchase_date: Iso8601;
  maturity_date: Iso8601;
  coupons: Array<{ date: Iso8601; amount: Currency }>;
}>;
