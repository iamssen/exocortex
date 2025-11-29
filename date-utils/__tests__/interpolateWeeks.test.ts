import { DateTime } from 'luxon';
import assert from 'node:assert';
import { describe, test } from 'node:test';
import type { Iso8601 } from '../../model/nominal-types.js';
import { interpolateWeeks } from '../interpolateWeeks.js';

describe('interpolateWeeks()', () => {
  test('should get interpolated weeks', () => {
    const from = '2023-07-01' as Iso8601;
    const to = '2023-08-28' as Iso8601;

    const result = interpolateWeeks(from, to);

    assert.strictEqual(
      result[0],
      DateTime.fromISO(from).toFormat(`kkkk-'W'WW`),
    );
    assert.strictEqual(
      result.at(-1),
      DateTime.fromISO(to).toFormat(`kkkk-'W'WW`),
    );
  });
});
