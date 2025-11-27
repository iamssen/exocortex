import { groupByQuarter } from '../date-utils/index.js';
import type { AggregatedTrade, JoinedTrade } from '../model/index.js';

export function aggregateTrades(trades: JoinedTrade[]): AggregatedTrade[] {
  const grouped = groupByQuarter(trades, ({ trade }) => trade.date, 'ASC');

  return grouped.map(({ range, children }) => {
    return {
      range,
      totalBuy: children.reduce((t, { trade }) => {
        return trade.quantity > 0 ? t + trade.quantity * trade.price : t;
      }, 0),
      totalSell: children.reduce((t, { trade }) => {
        return trade.quantity < 0 ? t + trade.quantity * -1 * trade.price : t;
      }, 0),
      totalGain: children.reduce((t, { trade, quote }) => {
        return quote ? t + (quote.price - trade.price) * trade.quantity : t;
      }, 0),
      trades: children,
    };
  });
}
