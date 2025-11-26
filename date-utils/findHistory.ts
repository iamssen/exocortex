import { DateTime } from 'luxon';
import type { ASC, Iso8601 } from '../model/nominal-types.js';

interface ExactMatch<T> {
  match: 'exact';
  searchDate: Iso8601;
  data: T;
}

interface RangedMatch<T> {
  match: 'ranged';
  searchDate: Iso8601;
  data: [T, T];
}

interface BeforeMatch<T> {
  match: 'before';
  searchDate: Iso8601;
  data: T;
}

interface AfterMatch<T> {
  match: 'after';
  searchDate: Iso8601;
  data: T;
}

export type HistoryMatch<T> =
  | ExactMatch<T>
  | RangedMatch<T>
  | BeforeMatch<T>
  | AfterMatch<T>;

export const findHistory =
  <T extends {}>(pickDate: (item: T) => Iso8601) =>
  (history: ASC<T>, date: Iso8601): HistoryMatch<T> => {
    if (history.length === 0) {
      throw new Error(`history can't be empty`);
    }

    const searchDate = date.slice(0, 10) as Iso8601;
    const search = DateTime.fromISO(searchDate);

    let left = 0;
    let right = history.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midDate = DateTime.fromISO(pickDate(history[mid]).slice(0, 10));

      if (midDate.diff(search, 'day').days === 0) {
        return { match: 'exact', searchDate, data: history[mid] };
      } else if (midDate.diff(search, 'day').days < 0) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    if (left === 0) {
      return { match: 'before', searchDate, data: history[0] };
    } else if (left === history.length) {
      return {
        match: 'after',
        searchDate,
        data: history.at(-1)!,
      };
    } else {
      return {
        match: 'ranged',
        searchDate,
        data: [history[left - 1], history[left]],
      };
    }
  };
