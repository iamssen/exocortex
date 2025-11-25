import type {
  Balances,
  Bonds,
  Deposits,
  FX,
  Holding,
  Trade,
} from './finance-data.js';
import type { Percent } from './nominal-types.js';
import type { JoinedQuoteStatistics, MarketState, Quote } from './quote.js';

// TODO add generic type <Currency extends number = number>
export interface Gain {
  sharesGain: number;
  sharesGainPercent: Percent;
  realizedGain: number;
  daysGain: number;
  daysGainPercent: Percent;
  totalGain: number;
  totalGainPercent: Percent;
  marketValue: number;
}

export interface JoinedHolding {
  holding: Holding;
  gain: Gain;
  trades?: JoinedTrade[];
  quote?: Quote;
  statistic?: JoinedQuoteStatistics;
}

export interface JoinedHoldings {
  marketState?: MarketState;
  holdings: JoinedHolding[];
  gain: Gain;
}

export interface JoinedTrade {
  isFirstAppearedDate?: true;
  trade: Trade;
  quote?: Quote;
}

export interface JoinedFX<Currency extends number = number> {
  fx: FX<Currency>;
  gain: Gain;
  quote?: Quote;

  totalAmount: Currency;
  balances: Balances<Currency>;
  deposits?: Deposits<Currency>;
  bonds?: Bonds<Currency>;
}
