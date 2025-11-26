import { DateTime } from 'luxon';
import type { Iso8601 } from '../model/nominal-types.js';
import type { DateTimeSource } from './toDateTime.js';
import { toDateTime } from './toDateTime.js';

function filter(d: DateTimeSource | undefined | null): d is DateTimeSource {
  return !!d;
}

export function minDate(
  ...dates: (DateTimeSource | undefined | null)[]
): Iso8601 {
  const timestamp = Math.min(
    ...dates.filter(filter).map((d) => toDateTime(d).toMillis()),
  );
  return DateTime.fromMillis(timestamp).toISODate() as Iso8601;
}

export function maxDate(
  ...dates: (DateTimeSource | undefined | null)[]
): Iso8601 {
  const timestamp = Math.max(
    ...dates.filter(filter).map((d) => toDateTime(d).toMillis()),
  );
  return DateTime.fromMillis(timestamp).toISODate() as Iso8601;
}
