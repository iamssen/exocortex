import type { JoinedTrade } from './join.js';
import type { Iso8601 } from './nominal-types.js';

export interface AggregatedTrade {
  range: [Iso8601, Iso8601];

  totalBuy: number;
  totalSell: number;
  totalGain: number;

  trades: JoinedTrade[];
}
