import type { DurationLike } from 'luxon';
import { DateTime } from 'luxon';
import type { HistoryMatch } from '../date-utils/index.js';
import { findHistories } from '../date-utils/index.js';
import type { ASC, Iso8601, QuoteRecord } from '../model/index.js';

export function pickQuoteHistoryRecords(
  records: ASC<QuoteRecord>,
  findingDates: (Iso8601 | DurationLike)[],
  baseDate: Iso8601 = DateTime.now().toISODate() as Iso8601,
): HistoryMatch<QuoteRecord>[] {
  const base = DateTime.fromISO(baseDate.slice(0, 10));
  const dates = findingDates.map((d) =>
    typeof d === 'string'
      ? (d.slice(0, 10) as Iso8601)
      : (base.minus(d).toISODate() as Iso8601),
  );

  const pick = findHistories<QuoteRecord>((r) => r.date);

  return pick(records, dates);
}
