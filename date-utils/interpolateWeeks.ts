import type { IsoWeek } from '../model/nominal-types.js';
import type { DateTimeSource } from './toDateTime.js';
import { toDateTime } from './toDateTime.js';

const WEEK_FORMAT = `kkkk-'W'WW`;

export function interpolateWeeks(
  from: DateTimeSource,
  to: DateTimeSource,
): IsoWeek[] {
  let d = toDateTime(from).startOf('week');
  const end = toDateTime(to).startOf('week');

  if (d.toMillis() > end.toMillis()) {
    throw new Error(`"from" must less than "to" (from: ${from}, to: ${to})}`);
  } else if (d.toMillis() === end.toMillis()) {
    return [end.toFormat(WEEK_FORMAT) as IsoWeek];
  }

  const weeks: IsoWeek[] = [];

  while (d.toMillis() <= end.toMillis()) {
    const week = d.toFormat(WEEK_FORMAT) as IsoWeek;
    weeks.push(week);
    d = d.plus({ week: 1 });
  }

  return weeks;
}
