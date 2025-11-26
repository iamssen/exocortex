import { DateTime } from 'luxon';
import type { Iso8601 } from '../model/nominal-types.js';

export const findStartIndex =
  <T extends {}>(pickDate: (item: T) => DateTime, zone?: string) =>
  (list: T[], date: DateTime | Iso8601 | number): number => {
    const searchDate =
      typeof date === 'string'
        ? DateTime.fromISO(date, { zone })
        : typeof date === 'number'
          ? DateTime.fromMillis(date, { zone })
          : date;

    let i: number = list.length;
    while (--i >= 0) {
      const itemDate = pickDate(list[i]).startOf('day');
      const diffDays = itemDate.diff(searchDate, 'day').days;

      if (diffDays <= 0) {
        return i;
      }
    }

    return 0;
  };
