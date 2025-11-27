import type {
  Gain,
  Holding,
  JoinedHolding,
  JoinedHoldings,
  MarketState,
  Percent,
  Quote,
  QuoteStatistics,
} from '../model/index.js';
import { fillPercentToGain } from './helpers/fillPercentToGain.js';
import { joinQuoteStatisticsAndQuote } from './joinQuoteStatisticsAndQuote.js';
import { joinTradesAndQuotes } from './joinTradesAndQuotes.js';

export function joinHoldingsAndQuotes(
  holdings: Holding[],
  quotes: Map<string, Quote>,
  statistics?: Map<string, QuoteStatistics>,
): JoinedHoldings {
  if (!holdings || holdings.length === 0) {
    return {
      holdings: [],
      gain: fillPercentToGain({
        sharesGain: 0,
        realizedGain: 0,
        daysGain: 0,
        totalGain: 0,
        marketValue: 0,
      }),
    };
  }

  const marketStates: Map<MarketState, number> = holdings
    .map(({ symbol }) => quotes.get(symbol)?.marketState)
    .filter((marketState): marketState is MarketState => !!marketState)
    .reduce((map, marketState) => {
      map.set(marketState, (map.get(marketState) ?? 0) + 1);
      return map;
    }, new Map<MarketState, number>());

  const marketState =
    [...marketStates].toSorted((a, b) => {
      return b[1] - a[1];
    })?.[0]?.[0] ?? 'CLOSED';

  const joinedHoldings = holdings.map<JoinedHolding>((holding) => {
    const quote = quotes.get(holding.symbol);
    const statistic =
      statistics?.has(holding.symbol) && quote
        ? joinQuoteStatisticsAndQuote(statistics.get(holding.symbol)!, quote)
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

    if (marketState === 'PRE' && marketState !== quote.marketState) {
      const correctedQuote = {
        ...quote,
        marketState,
        change: 0,
        changePercent: 0 as Percent,
      };
      return {
        holding,
        quote: correctedQuote,
        trades: joinTradesAndQuotes(holding.trades, correctedQuote),
        statistic,
        gain: fillPercentToGain({
          sharesGain,
          realizedGain: holding.realizedGain,
          daysGain: 0,
          totalGain: holding.realizedGain + sharesGain,
          marketValue,
        }),
      };
    }

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
  });

  // total gain
  const totalGain: Omit<
    Gain,
    'totalGainPercent' | 'daysGainPercent' | 'sharesGainPercent'
  > = {
    sharesGain: 0,
    realizedGain: 0,
    daysGain: 0,
    totalGain: 0,
    marketValue: 0,
  };

  if (joinedHoldings) {
    let i: number = joinedHoldings.length;
    while (--i >= 0) {
      const { gain: g } = joinedHoldings[i];
      if (g) {
        totalGain.sharesGain += g.sharesGain;
        totalGain.realizedGain += g.realizedGain;
        totalGain.daysGain += g.daysGain;
        totalGain.totalGain += g.totalGain;
        totalGain.marketValue += g.marketValue;
      }
    }
  }

  return {
    marketState,
    holdings: joinedHoldings,
    gain: fillPercentToGain(totalGain),
  };
}
