import { DateTime } from 'luxon';
import assert from 'node:assert';
import { describe, test } from 'node:test';
import type { Iso8601 } from '../../model/nominal-types.js';
import { findStartIndex } from '../findStartIndex.js';

describe('findStartIndex()', () => {
  test('should get start index from list', () => {
    const list = [
      '2023-01-01',
      '2023-02-05',
      '2023-03-07',
      '2023-04-21',
      '2023-05-30',
    ] as Iso8601[];

    const fn = findStartIndex<Iso8601>((date) => DateTime.fromISO(date));

    assert.strictEqual(fn(list, '2023-03-01' as Iso8601), 1);
    assert.strictEqual(fn(list, '2023-03-07' as Iso8601), 2);
    assert.strictEqual(fn(list, '2023-02-02' as Iso8601), 0);
    assert.strictEqual(fn(list, '2023-09-02' as Iso8601), 4);
    assert.strictEqual(fn(list, '1980-09-02' as Iso8601), 0);
  });
});
