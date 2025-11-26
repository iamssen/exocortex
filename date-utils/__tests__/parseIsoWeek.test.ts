import assert from 'node:assert';
import { describe, test } from 'node:test';
import type { IsoWeek } from '../../types/nominal-types.js';
import { parseIsoWeek } from '../parseIsoWeek.js';

describe('parseIsoWeek()', () => {
  test('should get start and end dates from iso week', () => {
    const [start, end] = parseIsoWeek('2023-W34' as IsoWeek);
    assert.strictEqual(start, '2023-08-21');
    assert.strictEqual(end, '2023-08-27');
  });
});
