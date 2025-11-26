import type { Quote } from '../finance/quote.js';
import type { Balances } from './balance.js';
import type { Bonds } from './bond.js';
import type { Deposits } from './deposit.js';
import type { FX } from './fx.js';
import type { Gain } from './holding.projection.js';

export interface JoinedFX<Currency extends number = number> {
  fx: FX<Currency>;
  gain: Gain;
  quote?: Quote;

  totalAmount: Currency;
  balances: Balances<Currency>;
  deposits?: Deposits<Currency>;
  bonds?: Bonds<Currency>;
}
