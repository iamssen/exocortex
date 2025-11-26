import { DateTime } from 'luxon';
import type { Iso8601 } from '../model/nominal-types.js';

export interface GroupedMonth<T extends {}> {
  range: [Iso8601, Iso8601];
  /** yyyy-MM-01 */
  month: Iso8601;
  children: T[];
}

export function groupByMonth<T extends {}>(
  list: T[],
  dateKey: keyof T,
  sort: 'ASC' | 'DESC' = 'ASC',
  sortChildren: 'ASC' | 'DESC' = sort,
): GroupedMonth<T>[] {
  const groups = new Map<Iso8601, GroupedMonth<T>>();

  let i: number = -1;
  const max: number = list.length;
  while (++i < max) {
    const item = list[i];
    const date = item[dateKey] as Iso8601;
    const month: Iso8601 = (date.slice(0, 8) + '01') as Iso8601;

    if (!groups.has(month)) {
      const start = DateTime.fromISO(month)
        .startOf('month')
        .toISO({ suppressMilliseconds: true });

      const end = DateTime.fromISO(month)
        .endOf('month')
        .toISO({ suppressMilliseconds: true });

      if (!start || !end) {
        throw new Error(`start or end can't be empty`);
      }

      groups.set(month, {
        range: [start as Iso8601, end as Iso8601],
        month,
        children: [],
      });
    }

    groups.get(month)!.children.push(item);
  }

  return [...groups]
    .toSorted(([a], [b]) => {
      return sort === 'ASC'
        ? new Date(a).getTime() - new Date(b).getTime()
        : new Date(b).getTime() - new Date(a).getTime();
    })
    .map(([, { range, month, children }]) => {
      return {
        range,
        month,
        children: children.toSorted((a, b) => {
          return sortChildren === 'ASC'
            ? new Date(a[dateKey] as Iso8601).getTime() -
                new Date(b[dateKey] as Iso8601).getTime()
            : new Date(b[dateKey] as Iso8601).getTime() -
                new Date(a[dateKey] as Iso8601).getTime();
        }),
      };
    });
}
