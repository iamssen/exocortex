import type { Iso8601, Percent, Ratio } from '../nominal-types.js';

export interface CurrentMarketValuation {
  date: Iso8601;
  value: string;
  link: string;
}

export interface PeAndYields {
  name: string;
  tradeDate: Iso8601;
  priceEarningsRatio: Ratio;
  priceEarningsRatioEstimate: Ratio;
  priceEarningsRatio52WeekAgo: Ratio;
  ticker: string;
  yield: Percent;
  yield52WeekAgo: Percent;
}
