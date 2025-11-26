import type { Iso8601 } from '../nominal-types.js';
import type { JoinedTrade } from './trade.projection.js';

export interface AggregatedTrade {
  range: [Iso8601, Iso8601];

  totalBuy: number;
  totalSell: number;
  totalGain: number;

  trades: JoinedTrade[];
}
