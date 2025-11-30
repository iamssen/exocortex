import { DateTime } from 'luxon';
import { describe, expect, test } from 'vitest';
import type { Iso8601 } from '../../model/nominal-types.js';
import { interpolateWeeks } from '../interpolateWeeks.js';

describe('interpolateWeeks()', () => {
  test('should get interpolated weeks', () => {
    const from = '2023-07-01' as Iso8601;
    const to = '2023-08-28' as Iso8601;

    const result = interpolateWeeks(from, to);

    expect(result[0]).toBe(DateTime.fromISO(from).toFormat(`kkkk-'W'WW`));
    expect(result.at(-1)).toBe(DateTime.fromISO(to).toFormat(`kkkk-'W'WW`));
  });
});
