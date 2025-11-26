import { DateTime } from 'luxon';
import type { Iso8601, IsoQuarter } from '../model/nominal-types.js';

export interface GroupedQuarter<T extends {}> {
  range: [Iso8601, Iso8601];
  /** yyyy-'Q'q */
  quarter: IsoQuarter;
  children: T[];
}

const QUARTER_FORMAT = `yyyy-'Q'q`;

export function groupByQuarter<T extends {}>(
  list: T[],
  dateKey: keyof T | ((item: T) => Iso8601),
  sort: 'ASC' | 'DESC' = 'ASC',
  sortChildren: 'ASC' | 'DESC' = sort,
): GroupedQuarter<T>[] {
  const groups = new Map<IsoQuarter, GroupedQuarter<T>>();

  const getDate =
    typeof dateKey === 'function'
      ? dateKey
      : (item: T) => item[dateKey] as Iso8601;

  let i: number = -1;
  const max: number = list.length;
  while (++i < max) {
    const item: T = list[i];
    const date = DateTime.fromISO(getDate(item));
    const quarter: IsoQuarter = date.toFormat(QUARTER_FORMAT) as IsoQuarter;

    if (!groups.has(quarter)) {
      const start = DateTime.fromFormat(quarter, QUARTER_FORMAT)
        .startOf('quarter')
        .toISO({ suppressMilliseconds: true });

      const end = DateTime.fromFormat(quarter, QUARTER_FORMAT)
        .endOf('quarter')
        .toISO({ suppressMilliseconds: true });

      if (!start || !end) {
        throw new Error(`start or end can't be empty "${quarter}"`);
      }

      groups.set(quarter, {
        range: [start as Iso8601, end as Iso8601],
        quarter,
        children: [],
      });
    }

    groups.get(quarter)!.children.push(item);
  }

  return [...groups]
    .toSorted(([a], [b]) => {
      return sort === 'ASC'
        ? DateTime.fromFormat(a, QUARTER_FORMAT).toMillis() -
            DateTime.fromFormat(b, QUARTER_FORMAT).toMillis()
        : DateTime.fromFormat(b, QUARTER_FORMAT).toMillis() -
            DateTime.fromFormat(a, QUARTER_FORMAT).toMillis();
    })
    .map(([, { range, quarter, children }]) => {
      return {
        range,
        quarter,
        children: children.toSorted((a, b) => {
          return sortChildren === 'ASC'
            ? new Date(getDate(a)).getTime() - new Date(getDate(b)).getTime()
            : new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime();
        }),
      };
    });
}
