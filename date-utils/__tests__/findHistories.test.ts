import { describe, expect, test } from 'vitest';
import type { ASC, Iso8601 } from '../../model/nominal-types.js';
import { findHistories } from '../findHistories.js';

interface Item {
  date: Iso8601;
}

const find = findHistories(({ date }: Item) => date);

describe('findHistories()', () => {
  test('should find matched history items', () => {
    expect(
      find(
        [
          { date: '2023-01-01' },
          { date: '2023-01-02' },
          { date: '2023-01-03' },
          { date: '2023-01-04' },
        ] as ASC<Item>,
        ['2023-01-02' as Iso8601, '2023-01-04' as Iso8601],
      ),
    ).toEqual([
      {
        match: 'exact',
        searchDate: '2023-01-02',
        data: { date: '2023-01-02' },
      },
      {
        match: 'exact',
        searchDate: '2023-01-04',
        data: { date: '2023-01-04' },
      },
    ]);

    expect(
      find(
        [
          { date: '2023-01-01' },
          { date: '2023-02-01' },
          { date: '2023-03-01' },
          { date: '2023-04-01' },
        ] as ASC<Item>,
        ['2023-02-15' as Iso8601, '2023-04-21' as Iso8601],
      ),
    ).toEqual([
      {
        match: 'ranged',
        searchDate: '2023-02-15',
        data: [{ date: '2023-02-01' }, { date: '2023-03-01' }],
      },
      {
        match: 'after',
        searchDate: '2023-04-21',
        data: { date: '2023-04-01' },
      },
    ]);

    expect(
      find(
        [
          { date: '2023-01-01' },
          { date: '2023-02-01' },
          { date: '2023-03-01' },
          { date: '2023-04-01' },
        ] as ASC<Item>,
        [
          '2022-12-12' as Iso8601,
          '2022-04-15' as Iso8601,
          '2023-05-01' as Iso8601,
        ],
      ),
    ).toEqual([
      {
        match: 'before',
        searchDate: '2022-12-12',
        data: { date: '2023-01-01' },
      },
      {
        match: 'before',
        searchDate: '2022-04-15',
        data: { date: '2023-01-01' },
      },
      {
        match: 'after',
        searchDate: '2023-05-01',
        data: { date: '2023-04-01' },
      },
    ]);

    expect(() =>
      find([] as any as ASC<Item>, ['2023-01-01' as Iso8601]),
    ).toThrow();
  });
});
