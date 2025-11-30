import { DateTime } from 'luxon';
import { describe, expect, test } from 'vitest';
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

    expect(fn(list, '2023-03-01' as Iso8601)).toBe(1);
    expect(fn(list, '2023-03-07' as Iso8601)).toBe(2);
    expect(fn(list, '2023-02-02' as Iso8601)).toBe(0);
    expect(fn(list, '2023-09-02' as Iso8601)).toBe(4);
    expect(fn(list, '1980-09-02' as Iso8601)).toBe(0);
  });
});
