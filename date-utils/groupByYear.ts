import { DateTime } from 'luxon';
import type { Iso8601 } from '../model/nominal-types.js';

export interface GroupedYear<T extends {}> {
  range: [Iso8601, Iso8601];
  year: number;
  children: T[];
}

export function groupByYear<T extends {}>(
  list: T[],
  dateKey: keyof T,
  sort: 'ASC' | 'DESC' = 'ASC',
  sortChildren: 'ASC' | 'DESC' = sort,
): GroupedYear<T>[] {
  const groups = new Map<number, GroupedYear<T>>();

  let i: number = -1;
  const max: number = list.length;
  while (++i < max) {
    const item = list[i];
    const date = item[dateKey] as Iso8601;
    const year: number = new Date(date).getFullYear();

    if (!groups.has(year)) {
      const start = DateTime.fromISO(date)
        .startOf('year')
        .toISO({ suppressMilliseconds: true });

      const end = DateTime.fromISO(date)
        .endOf('year')
        .toISO({ suppressMilliseconds: true });

      if (!start || !end) {
        throw new Error(`start or end can't be empty`);
      }

      groups.set(year, {
        range: [start as Iso8601, end as Iso8601],
        year,
        children: [],
      });
    }

    groups.get(year)!.children.push(item);
  }

  return [...groups]
    .toSorted(([a], [b]) => {
      return sort === 'ASC' ? a - b : b - a;
    })
    .map(([, { range, year, children }]) => {
      return {
        range,
        year,
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
