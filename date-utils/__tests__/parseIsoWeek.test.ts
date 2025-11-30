import { describe, expect, test } from 'vitest';
import type { IsoWeek } from '../../model/nominal-types.js';
import { parseIsoWeek } from '../parseIsoWeek.js';

describe('parseIsoWeek()', () => {
  test('should get start and end dates from iso week', () => {
    const [start, end] = parseIsoWeek('2023-W34' as IsoWeek);
    expect(start).toBe('2023-08-21');
    expect(end).toBe('2023-08-27');
  });
});
