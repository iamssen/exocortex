import { DateTime } from 'luxon';
import type { Iso8601 } from '../model/nominal-types.js';

export type DateTimeSource = Iso8601 | Date | number;

export function toDateTime(source: DateTimeSource): DateTime {
  return typeof source === 'number'
    ? DateTime.fromMillis(source)
    : typeof source === 'string'
      ? DateTime.fromISO(source)
      : DateTime.fromJSDate(source);
}
