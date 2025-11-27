import type { Iso8601, JoinedTrade, Quote, Trade } from '../model/index.js';

export function joinTradesAndQuotes(
  trades: Trade[],
  quoteOrQuotes: Quote | Map<string, Quote> | undefined,
): JoinedTrade[] {
  const quotes =
    quoteOrQuotes instanceof Map
      ? quoteOrQuotes
      : quoteOrQuotes
        ? new Map([[quoteOrQuotes.symbol, quoteOrQuotes]])
        : new Map();

  const rows = trades
    .map<JoinedTrade>((trade) => ({
      trade,
      quote: quotes.get(trade.symbol),
    }))
    .toSorted((a, b) => {
      return (
        new Date(b.trade.date).getTime() - new Date(a.trade.date).getTime()
      );
    });

  const definedDate = new Set<Iso8601>();

  for (const row of rows) {
    if (!definedDate.has(row.trade.date)) {
      row.isFirstAppearedDate = true;
      definedDate.add(row.trade.date);
    }
  }

  return rows;
}
