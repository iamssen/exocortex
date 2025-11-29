import assert from 'node:assert';
import { describe, test } from 'node:test';
import type { ASC, Iso8601 } from '../../model/nominal-types.js';
import { findHistory } from '../findHistory.js';

interface Item {
  date: Iso8601;
}

const find = findHistory(({ date }: Item) => date);

describe('findHistory()', () => {
  test('should find matched history item', () => {
    assert.deepStrictEqual(
      find(
        [
          { date: '2023-01-01' },
          { date: '2023-01-02' },
          { date: '2023-01-03' },
          { date: '2023-01-04' },
        ] as ASC<Item>,
        '2023-01-02' as Iso8601,
      ),
      {
        match: 'exact',
        searchDate: '2023-01-02',
        data: { date: '2023-01-02' },
      },
    );

    assert.deepStrictEqual(
      find(
        [
          { date: '2023-01-01' },
          { date: '2023-02-01' },
          { date: '2023-03-01' },
          { date: '2023-04-01' },
        ] as ASC<Item>,
        '2023-02-15' as Iso8601,
      ),
      {
        match: 'ranged',
        searchDate: '2023-02-15',
        data: [{ date: '2023-02-01' }, { date: '2023-03-01' }],
      },
    );

    assert.deepStrictEqual(
      find(
        [
          { date: '2023-01-01' },
          { date: '2023-02-01' },
          { date: '2023-03-01' },
          { date: '2023-04-01' },
        ] as ASC<Item>,
        '2022-04-15' as Iso8601,
      ),
      {
        match: 'before',
        searchDate: '2022-04-15',
        data: { date: '2023-01-01' },
      },
    );

    assert.deepStrictEqual(
      find(
        [
          { date: '2023-01-01' },
          { date: '2023-02-01' },
          { date: '2023-03-01' },
          { date: '2023-04-01' },
        ] as ASC<Item>,
        '2023-04-15' as Iso8601,
      ),
      {
        match: 'after',
        searchDate: '2023-04-15',
        data: { date: '2023-04-01' },
      },
    );

    assert.throws(() => find([] as any as ASC<Item>, '2023-01-01' as Iso8601));
  });
});
