import assert from 'node:assert';
import { describe, test } from 'node:test';
import type { ASC, Iso8601 } from '../../types/nominal-types.js';
import { findHistories } from '../findHistories.js';

interface Item {
  date: Iso8601;
}

const find = findHistories(({ date }: Item) => date);

describe('findHistories()', () => {
  test('should find matched history items', () => {
    assert.deepStrictEqual(
      find(
        [
          { date: '2023-01-01' },
          { date: '2023-01-02' },
          { date: '2023-01-03' },
          { date: '2023-01-04' },
        ] as ASC<Item>,
        ['2023-01-02' as Iso8601, '2023-01-04' as Iso8601],
      ),
      [
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
      ],
    );

    assert.deepStrictEqual(
      find(
        [
          { date: '2023-01-01' },
          { date: '2023-02-01' },
          { date: '2023-03-01' },
          { date: '2023-04-01' },
        ] as ASC<Item>,
        ['2023-02-15' as Iso8601, '2023-04-21' as Iso8601],
      ),
      [
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
      ],
    );

    assert.deepStrictEqual(
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
      [
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
      ],
    );

    assert.throws(() =>
      find([] as any as ASC<Item>, ['2023-01-01' as Iso8601]),
    );
  });
});
