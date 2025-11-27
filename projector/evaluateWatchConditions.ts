import type {
  Match,
  Quote,
  QuoteHistory,
  QuoteStatistics,
  Watch,
} from '../model/index.js';
import { joinQuoteHistoryAndQuote } from './joinQuoteHistoryAndQuote.js';
import { joinQuoteStatisticsAndQuote } from './joinQuoteStatisticsAndQuote.js';

export function evaluateWatchConditions(
  watch: Watch,
  quote: Quote | undefined,
  statistic: QuoteStatistics | undefined,
  history: QuoteHistory | undefined,
): Match {
  return watch.map((w) => {
    if ('high_price' in w) {
      return quote
        ? {
            match: quote.price > w.high_price,
            high_price: w.high_price,
            current_price: quote.price,
          }
        : { match: false, high_price: w.high_price };
    } else if ('low_price' in w) {
      return quote
        ? {
            match: quote.price < w.low_price,
            low_price: w.low_price,
            current_price: quote.price,
          }
        : { match: false, low_price: w.low_price };
    } else if ('high_pe' in w) {
      if (!statistic || !quote) {
        return {
          match: false,
          high_pe: w.high_pe,
        };
      }
      const s = joinQuoteStatisticsAndQuote(statistic, quote);
      return typeof s.trailingPE === 'number'
        ? {
            match: s.trailingPE > w.high_pe,
            high_pe: w.high_pe,
            current_pe: s.trailingPE,
          }
        : {
            match: false,
            high_pe: w.high_pe,
          };
    } else if ('low_pe' in w) {
      if (!statistic || !quote) {
        return {
          match: false,
          low_pe: w.low_pe,
        };
      }
      const s = joinQuoteStatisticsAndQuote(statistic, quote);
      return typeof s?.trailingPE === 'number'
        ? {
            match: s.trailingPE < w.low_pe,
            low_pe: w.low_pe,
            current_pe: s.trailingPE,
          }
        : {
            match: false,
            low_pe: w.low_pe,
          };
    } else if ('high_52week' in w) {
      if (quote && statistic?.fiftyTwoWeekRange) {
        const s = joinQuoteStatisticsAndQuote(statistic, quote);
        return {
          match: s.fiftyTwoWeekPosition! > w.high_52week,
          high_52week: w.high_52week,
          current_52week: s.fiftyTwoWeekPosition!,
        };
      } else if (quote && history?.fiftyTwoWeekRange) {
        const s = joinQuoteHistoryAndQuote(history, quote);
        return {
          match: s.fiftyTwoWeekPosition > w.high_52week,
          high_52week: w.high_52week,
          current_52week: s.fiftyTwoWeekPosition!,
        };
      } else {
        return {
          match: false,
          high_52week: w.high_52week,
        };
      }
    } else if ('low_52week' in w) {
      if (quote && statistic?.fiftyTwoWeekRange) {
        const s = joinQuoteStatisticsAndQuote(statistic, quote);
        return {
          match: s.fiftyTwoWeekPosition! < w.low_52week,
          low_52week: w.low_52week,
          current_52week: s.fiftyTwoWeekPosition!,
        };
      } else if (quote && history?.fiftyTwoWeekRange) {
        const s = joinQuoteHistoryAndQuote(history, quote);
        return {
          match: s.fiftyTwoWeekPosition < w.low_52week,
          low_52week: w.low_52week,
          current_52week: s.fiftyTwoWeekPosition!,
        };
      } else {
        return {
          match: false,
          low_52week: w.low_52week,
        };
      }
    } else {
      throw new Error(`Unkown watch "${JSON.stringify(w)}"`);
    }
  });
}

export function hasMatchHigh(match: Match): boolean {
  return match.some(
    (m) =>
      m.match && ('high_price' in m || 'high_pe' in m || 'high_52week' in m),
  );
}

export function hasMatchLow(match: Match): boolean {
  return match.some(
    (m) => m.match && ('low_price' in m || 'low_pe' in m || 'low_52week' in m),
  );
}
