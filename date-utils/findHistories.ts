import type { ASC, Iso8601 } from '../model/nominal-types.js';
import type { HistoryMatch } from './findHistory.js';

interface HistoryCache<T> {
  date: Iso8601;
  time: number;
  value: T;
}

class History<T> {
  #cache = new Map<number, HistoryCache<T>>();
  readonly #pickDate: (item: T) => Iso8601;
  readonly #history: ASC<T>;

  constructor(pickDate: (item: T) => Iso8601, history: ASC<T>) {
    this.#pickDate = pickDate;
    this.#history = history;
  }

  at = (index: number): HistoryCache<T> => {
    if (this.#cache.has(index)) {
      return this.#cache.get(index)!;
    }

    const value = this.#history.at(index);

    if (!value) {
      throw new Error('Undefined item');
    }

    const date = this.#pickDate(value).slice(0, 10) as Iso8601;
    const time = new Date(date).getTime();

    const cache: HistoryCache<T> = {
      date,
      time,
      value,
    };

    this.#cache.set(index, cache);

    return cache;
  };
}

export const findHistories =
  <T extends {}>(pickDate: (item: T) => Iso8601) =>
  (history: ASC<T>, _dates: Iso8601[]): HistoryMatch<T>[] => {
    if (history.length === 0) {
      throw new Error(`history can't be empty`);
    }

    const h = new History<T>(pickDate, history);

    const dates = _dates.map((d) => d.slice(0, 10));

    // Sort dates and create a map to store results
    // { date: string, index: int }
    const sortedDates = dates
      .map((d, index) => {
        const date = d.slice(0, 10) as Iso8601;
        return { date, time: new Date(date).getTime(), index };
      })
      .toSorted((a, b) => a.time - b.time);

    const results: HistoryMatch<T>[] = Array.from({ length: dates.length });

    let historyIndex = 0;
    let dateIndex = 0;

    while (dateIndex < sortedDates.length) {
      const { date: searchDate, time, index } = sortedDates[dateIndex];

      // Handle cases before the first history item
      if (time < h.at(0).time) {
        results[index] = { match: 'before', searchDate, data: h.at(0).value };
        dateIndex++;
        continue;
      }

      // Handle cases after the last history item
      if (time > h.at(-1).time) {
        results[index] = { match: 'after', searchDate, data: h.at(-1).value };
        dateIndex++;
        continue;
      }

      // Find the appropriate position in history
      while (
        historyIndex < history.length - 1 &&
        h.at(historyIndex + 1).time <= time
      ) {
        historyIndex++;
      }

      // Determine the match type
      if (h.at(historyIndex).time === time) {
        results[index] = {
          match: 'exact',
          searchDate,
          data: h.at(historyIndex).value,
        };
      } else if (historyIndex < history.length - 1) {
        results[index] = {
          match: 'ranged',
          searchDate,
          data: [h.at(historyIndex).value, h.at(historyIndex + 1).value],
        };
      } else {
        // This case should not occur given the previous checks, but it's here for completeness
        results[index] = {
          match: 'after',
          searchDate,
          data: h.at(historyIndex).value,
        };
      }

      dateIndex++;
    }

    return results;
  };
