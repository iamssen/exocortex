import type {
  ASC,
  Iso8601,
  JoinedQuoteHistory,
  Quote,
  QuoteHistory,
  QuoteRecord,
} from '../model/index.js';
import { getFiftyTwoWeekPosition } from './helpers/getFiftyTwoWeekPosition.js';

export function joinQuoteHistoryAndQuote(
  history: QuoteHistory,
  quote?: Quote,
): JoinedQuoteHistory {
  const { records, fiftyTwoWeekRange } = history;
  const lastRecord = records.at(-1);

  if (!lastRecord) {
    throw new Error(`lastRecord must not be empty`);
  }

  if (quote && quote.time.slice(0, 10) !== lastRecord.date) {
    const newFiftyTwoWeekRange = {
      low: Math.min(quote.price, fiftyTwoWeekRange.low),
      high: Math.max(quote.price, fiftyTwoWeekRange.high),
    };

    return {
      quote,
      records: [
        ...records,
        {
          date: quote.time.slice(0, 10) as Iso8601,
          open: quote.price,
          close: quote.price,
          low: quote.price,
          high: quote.price,
        },
      ] as ASC<QuoteRecord>,
      fiftyTwoWeekRange: newFiftyTwoWeekRange,
      fiftyTwoWeekPosition: getFiftyTwoWeekPosition(
        quote.price,
        newFiftyTwoWeekRange,
      ),
    };
  }

  return {
    quote,
    records: history.records,
    fiftyTwoWeekRange: history.fiftyTwoWeekRange,
    fiftyTwoWeekPosition: getFiftyTwoWeekPosition(
      lastRecord.close,
      fiftyTwoWeekRange,
    ),
  };
}
