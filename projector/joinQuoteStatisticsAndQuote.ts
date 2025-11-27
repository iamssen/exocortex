import type {
  JoinedQuoteStatistics,
  Quote,
  QuoteStatistics,
  Ratio,
} from '../model/index.js';
import { getFiftyTwoWeekPosition } from './helpers/getFiftyTwoWeekPosition.js';

export function joinQuoteStatisticsAndQuote(
  statistics: QuoteStatistics,
  quote: Quote,
): JoinedQuoteStatistics {
  if (quote.price === statistics.price) {
    return {
      ...statistics,
      trailingPE:
        typeof statistics.epsTrailingTwelveMonths === 'number' &&
        statistics.epsTrailingTwelveMonths <= 0
          ? undefined
          : statistics.trailingPE,
      forwardPE:
        typeof statistics.epsForward === 'number' && statistics.epsForward <= 0
          ? undefined
          : statistics.forwardPE,
      ...quote,
      fiftyTwoWeekPosition: statistics.fiftyTwoWeekRange
        ? getFiftyTwoWeekPosition(quote.price, statistics.fiftyTwoWeekRange)
        : undefined,
    };
  }

  const {
    epsTrailingTwelveMonths,
    epsForward,
    bookValue,
    fiftyTwoWeekRange,
    ...restStatistics
  } = statistics;

  const newFiftyTwoWeekRange = fiftyTwoWeekRange
    ? {
        low: Math.min(fiftyTwoWeekRange.low, quote.price),
        high: Math.max(fiftyTwoWeekRange.high, quote.price),
      }
    : undefined;

  return {
    ...restStatistics,
    epsTrailingTwelveMonths,
    epsForward,
    bookValue,
    trailingPE:
      typeof epsTrailingTwelveMonths === 'number' && epsTrailingTwelveMonths > 0
        ? ((quote.price / epsTrailingTwelveMonths) as Ratio)
        : undefined,
    forwardPE:
      typeof epsForward === 'number' && epsForward > 0
        ? ((quote.price / epsForward) as Ratio)
        : undefined,
    priceToBook:
      typeof bookValue === 'number'
        ? ((quote.price / bookValue) as Ratio)
        : undefined,
    fiftyTwoWeekRange: newFiftyTwoWeekRange,
    ...quote,
    fiftyTwoWeekPosition: newFiftyTwoWeekRange
      ? getFiftyTwoWeekPosition(quote.price, newFiftyTwoWeekRange)
      : undefined,
  };
}
