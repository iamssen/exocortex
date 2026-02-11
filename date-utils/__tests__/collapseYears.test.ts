import { describe, expect, test } from 'vitest';
import { collapseYears } from '../collapseYears.js';

describe('collapseYears()', () => {
  test('should collapse items', () => {
    const { list, collapsed } = collapseYears(
      [
        {
          year: 2026,
          couponGain: 4064,
          maturityGain: 1523,
        },
        {
          year: 2023,
          couponGain: 2472,
          maturityGain: 0,
        },
        {
          year: 2024,
          couponGain: 3708,
          maturityGain: 0,
        },
        {
          year: 2025,
          couponGain: 3708,
          maturityGain: 0,
        },
        {
          year: 2027,
          couponGain: 3708,
          maturityGain: 0,
        },
        {
          year: 2028,
          couponGain: 3708,
          maturityGain: 0,
        },
        {
          year: 2029,
          couponGain: 3708,
          maturityGain: 0,
        },
        {
          year: 2030,
          couponGain: 3708,
          maturityGain: 0,
        },
        {
          year: 2031,
          couponGain: 3708,
          maturityGain: 0,
        },
        {
          year: 2032,
          couponGain: 3708,
          maturityGain: -707,
        },
      ],
      'year',
      2026,
      2029,
    );

    expect(list).toHaveLength(3);
    expect(list.at(0)?.year).toBe(2026);
    expect(list.at(1)?.year).toBe(2027);
    expect(list.at(2)?.year).toBe(2028);
    expect(collapsed?.from).toBe(2029);
    expect(collapsed?.to).toBe(2032);
    expect(collapsed?.list).toHaveLength(4);
  });

  test('should not collapse values if there is only one value', () => {
    const a = collapseYears(
      [
        {
          year: 2026,
          couponGain: 1_118_124,
          maturityGain: 1_923_751,
        },
      ],
      'year',
      2026,
      2029,
    );

    const b = collapseYears(
      [
        {
          year: 2032,
          couponGain: 1_118_124,
          maturityGain: 1_923_751,
        },
      ],
      'year',
      2026,
      2029,
    );

    expect(a.list).toHaveLength(1);
    expect(a.collapsed).toBeUndefined();
    expect(b.list).toHaveLength(1);
    expect(b.collapsed).toBeUndefined();
  });

  test('should not collapse values if there is no before data than the reduceFromYear', () => {
    const { list, collapsed } = collapseYears(
      [
        {
          year: 2030,
          couponGain: 3708,
          maturityGain: 0,
        },
        {
          year: 2031,
          couponGain: 3708,
          maturityGain: 0,
        },
        {
          year: 2032,
          couponGain: 3708,
          maturityGain: -707,
        },
        {
          year: 2033,
          couponGain: 3708,
          maturityGain: -707,
        },
        {
          year: 2034,
          couponGain: 3708,
          maturityGain: -707,
        },
      ],
      'year',
      2026,
      2029,
    );

    expect(list).toHaveLength(5);
    expect(collapsed).toBeUndefined();
  });
});
