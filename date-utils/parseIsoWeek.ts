import { DateTime } from 'luxon';
import type { Iso8601, IsoWeek } from '../model/nominal-types.js';

export function parseIsoWeek(week: IsoWeek): [Iso8601, Iso8601] {
  const date = DateTime.fromFormat(week, `kkkk-'W'WW`);
  return [
    date.startOf('week').toISODate() as Iso8601,
    date.endOf('week').toISODate() as Iso8601,
  ];
}
