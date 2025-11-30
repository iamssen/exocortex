import { describe, expect, test } from 'vitest';
import type { Iso8601 } from '../../model/nominal-types.js';
import { interpolateMonths } from '../interpolateMonths.js';

describe('interpolateMonths()', () => {
  test('should get interpolated months', () => {
    const from = '2022-06-01' as Iso8601;
    const to = '2023-08-28' as Iso8601;

    const result = interpolateMonths(from, to);

    expect(result).toEqual([
      '2022-06-01',
      '2022-07-01',
      '2022-08-01',
      '2022-09-01',
      '2022-10-01',
      '2022-11-01',
      '2022-12-01',
      '2023-01-01',
      '2023-02-01',
      '2023-03-01',
      '2023-04-01',
      '2023-05-01',
      '2023-06-01',
      '2023-07-01',
      '2023-08-01',
    ]);
  });
});
