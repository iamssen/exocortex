import type { Iso8601 } from '../model/nominal-types.js';
import type { DateTimeSource } from './toDateTime.js';
import { toDateTime } from './toDateTime.js';

export function interpolateMonths(
  from: DateTimeSource,
  to: DateTimeSource,
): Iso8601[] {
  let d = toDateTime(from).startOf('month');
  const end = toDateTime(to).startOf('month');

  if (d.toMillis() > end.toMillis()) {
    throw new Error(`"from" must less than "to" (from: ${from}, to: ${to})}`);
  } else if (d.toMillis() === end.toMillis()) {
    return [end.toISO() as Iso8601];
  }

  const months: Iso8601[] = [];

  while (d.toMillis() <= end.toMillis()) {
    const month = d.toISODate() as Iso8601;
    months.push(month);
    d = d.plus({ month: 1 });
  }

  return months;
}
