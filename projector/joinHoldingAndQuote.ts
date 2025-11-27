import type {
  Holding,
  JoinedHolding,
  Quote,
  QuoteStatistics,
} from '../model/index.js';
import { fillPercentToGain } from './helpers/fillPercentToGain.js';
import { joinQuoteStatisticsAndQuote } from './joinQuoteStatisticsAndQuote.js';
import { joinTradesAndQuotes } from './joinTradesAndQuotes.js';

export function joinHoldingAndQuote(
  holding: Holding,
  quoteOrQuotes: Map<string, Quote> | Quote | undefined,
  statisticOrStatistics:
    | Map<string, QuoteStatistics>
    | QuoteStatistics
    | undefined,
): JoinedHolding {
  const quote =
    quoteOrQuotes instanceof Map
      ? quoteOrQuotes.get(holding.symbol)
      : quoteOrQuotes;

  const _statistic =
    statisticOrStatistics instanceof Map
      ? statisticOrStatistics.get(holding.symbol)
      : statisticOrStatistics;

  const statistic =
    _statistic && quote
      ? joinQuoteStatisticsAndQuote(_statistic, quote)
      : undefined;

  if (!quote) {
    return {
      holding,
      statistic,
      gain: fillPercentToGain({
        sharesGain: 0,
        realizedGain: holding.realizedGain,
        daysGain: 0,
        totalGain: holding.realizedGain,
        marketValue: 0,
      }),
    };
  }

  const { price, change } = quote;
  const sharesGain =
    price * holding.shares - holding.avgCostPerShare * holding.shares;
  const daysGain = holding.shares * change;
  const marketValue = holding.shares * price;

  return {
    holding,
    quote,
    trades: joinTradesAndQuotes(holding.trades, quote),
    statistic,
    gain: fillPercentToGain({
      sharesGain,
      realizedGain: holding.realizedGain,
      daysGain,
      totalGain: holding.realizedGain + sharesGain,
      marketValue,
    }),
  };
}
