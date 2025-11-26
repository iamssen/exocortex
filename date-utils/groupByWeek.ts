import { DateTime } from 'luxon';
import type { Iso8601, IsoWeek } from '../model/nominal-types.js';

export interface GroupedWeek<T extends {}> {
  range: [Iso8601, Iso8601];
  /** kkkk-'W'WW */
  week: IsoWeek;
  children: [
    T | null,
    T | null,
    T | null,
    T | null,
    T | null,
    T | null,
    T | null,
  ];
}

const WEEK_FORMAT = `kkkk-'W'WW`;

export function groupByWeek<T extends {}>(
  list: T[],
  dateKey: keyof T,
  sort: 'ASC' | 'DESC' = 'ASC',
): GroupedWeek<T>[] {
  const groups = new Map<IsoWeek, GroupedWeek<T>>();

  let i: number = -1;
  const max: number = list.length;
  while (++i < max) {
    const item = list[i];
    const date = DateTime.fromISO(item[dateKey] as Iso8601);
    const week: IsoWeek = date.toFormat(WEEK_FORMAT) as IsoWeek;

    if (!groups.has(week)) {
      const start = DateTime.fromISO(week)
        .startOf('week')
        .toISO({ suppressMilliseconds: true });

      const end = DateTime.fromISO(week)
        .endOf('week')
        .toISO({ suppressMilliseconds: true });

      if (!start || !end) {
        throw new Error(`start or end can't be empty`);
      }

      groups.set(week, {
        range: [start as Iso8601, end as Iso8601],
        week,
        children: [null, null, null, null, null, null, null],
      });
    }

    groups.get(week)!.children[date.weekday - 1] = item;
  }

  return [...groups]
    .toSorted(([a], [b]) => {
      return sort === 'ASC'
        ? DateTime.fromFormat(a, WEEK_FORMAT).toMillis() -
            DateTime.fromFormat(b, WEEK_FORMAT).toMillis()
        : DateTime.fromFormat(b, WEEK_FORMAT).toMillis() -
            DateTime.fromFormat(a, WEEK_FORMAT).toMillis();
    })
    .map(([, v]) => v);
}
