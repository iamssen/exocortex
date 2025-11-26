import type { MarketState, Quote } from '../finance/quote.js';
import type { JoinedQuoteStatistics } from '../finance/quote.projection.js';
import type { Percent } from '../nominal-types.js';
import type { Holding } from './holding.js';
import type { JoinedTrade } from './trade.projection.js';

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
