import { describe, expect, test } from 'vitest';
import type { Bond, Iso8601, KRW } from '../../model/index.js';
import { sumBondsGain } from '../sumBondsGain.js';

describe('sumBondsGain()', () => {
  test('should match bonds gain', () => {
    expect(
      sumBondsGain(bonds, '2023-01-01' as Iso8601, '2023-12-31' as Iso8601),
    ).toEqual({
      maturityGain: 0,
      couponsGain:
        90_332 * 4 + 242_117 * 4 + 915_418 * 2 + 226_811 * 2 + 234_540 * 2,
    });

    expect(
      sumBondsGain(bonds, '2023-01-01' as Iso8601, '2024-01-31' as Iso8601),
    ).toEqual({
      maturityGain: 31_149_000 - 29_999_601,
      couponsGain:
        90_332 * 5 + 242_117 * 4 + 915_418 * 2 + 226_811 * 2 + 234_540 * 2,
    });
  });
});

const bonds = [
  {
    name: '스탠다드차타드21-01',
    amount: 31_149_000,
    purchasePrice: 29_999_601,
    purchaseDate: '2022-12-08',
    maturityDate: '2024-01-12',
    coupons: [
      {
        date: '2023-01-12',
        amount: 90_332,
      },
      {
        date: '2023-04-12',
        amount: 90_332,
      },
      {
        date: '2023-07-12',
        amount: 90_332,
      },
      {
        date: '2023-10-12',
        amount: 90_332,
      },
      {
        date: '2024-01-12',
        amount: 90_332,
      },
    ],
  },
  {
    name: 'SK매직6',
    amount: 30_609_000,
    purchasePrice: 29_999_880,
    purchaseDate: '2022-06-08',
    maturityDate: '2025-03-04',
    coupons: [
      {
        date: '2022-09-03',
        amount: 242_117,
      },
      {
        date: '2022-12-03',
        amount: 242_117,
      },
      {
        date: '2023-03-03',
        amount: 242_117,
      },
      {
        date: '2023-06-03',
        amount: 242_117,
      },
      {
        date: '2023-09-03',
        amount: 242_117,
      },
      {
        date: '2023-12-03',
        amount: 242_117,
      },
      {
        date: '2024-03-03',
        amount: 242_117,
      },
      {
        date: '2024-06-03',
        amount: 242_117,
      },
      {
        date: '2024-09-03',
        amount: 242_117,
      },
      {
        date: '2024-12-03',
        amount: 242_117,
      },
      {
        date: '2024-03-03',
        amount: 238_800,
      },
      {
        date: '2024-03-04',
        amount: 2653,
      },
    ],
  },
  {
    name: '한국전력 1204',
    amount: 49_751_000,
    purchasePrice: 49_999_755,
    purchaseDate: '2022-05-24',
    maturityDate: '2025-05-24',
    coupons: [
      {
        date: '2022-11-24',
        amount: 915_418,
      },
      {
        date: '2023-05-24',
        amount: 915_418,
      },
      {
        date: '2023-11-24',
        amount: 915_418,
      },
      {
        date: '2024-05-24',
        amount: 915_418,
      },
      {
        date: '2024-11-24',
        amount: 915_418,
      },
      {
        date: '2025-05-24',
        amount: 915_418,
      },
    ],
  },
  {
    name: '국민주택 1종 21-04',
    amount: 16_173_000,
    purchasePrice: 14_838_727,
    purchaseDate: '2022-06-14',
    maturityDate: '2026-04-30',
    coupons: [
      {
        date: '2026-04-30',
        amount: 824_823,
      },
    ],
  },
  {
    name: '국민주택 1종 21-11',
    amount: 5_751_000,
    purchasePrice: 5_161_522,
    purchaseDate: '2022-06-14',
    maturityDate: '2026-11-30',
    coupons: [
      {
        date: '2026-11-30',
        amount: 293_301,
      },
    ],
  },
  {
    name: '국고01125-3909(19-6) 1',
    amount: 40_322_000,
    purchasePrice: 29_999_568,
    purchaseDate: '2022-07-18',
    maturityDate: '2039-09-10',
    coupons: [
      {
        date: '2022-09-10',
        amount: 226_811,
      },
      {
        date: '2023-03-10',
        amount: 226_811,
      },
      {
        date: '2023-09-10',
        amount: 226_811,
      },
      {
        date: '2024-03-10',
        amount: 226_811,
      },
      {
        date: '2024-09-10',
        amount: 226_811,
      },
      {
        date: '2025-03-10',
        amount: 226_811,
      },
      {
        date: '2025-09-10',
        amount: 226_811,
      },
      {
        date: '2026-03-10',
        amount: 226_811,
      },
      {
        date: '2026-09-10',
        amount: 226_811,
      },
      {
        date: '2027-03-10',
        amount: 226_811,
      },
      {
        date: '2027-09-10',
        amount: 226_811,
      },
      {
        date: '2028-03-10',
        amount: 226_811,
      },
      {
        date: '2028-09-10',
        amount: 226_811,
      },
      {
        date: '2029-03-10',
        amount: 226_811,
      },
      {
        date: '2029-09-10',
        amount: 226_811,
      },
      {
        date: '2030-03-10',
        amount: 226_811,
      },
      {
        date: '2030-09-10',
        amount: 226_811,
      },
      {
        date: '2031-03-10',
        amount: 226_811,
      },
      {
        date: '2031-09-10',
        amount: 226_811,
      },
      {
        date: '2032-03-10',
        amount: 226_811,
      },
      {
        date: '2032-09-10',
        amount: 226_811,
      },
      {
        date: '2033-03-10',
        amount: 226_811,
      },
      {
        date: '2033-09-10',
        amount: 226_811,
      },
      {
        date: '2034-03-10',
        amount: 226_811,
      },
      {
        date: '2034-09-10',
        amount: 226_811,
      },
      {
        date: '2035-03-10',
        amount: 226_811,
      },
      {
        date: '2035-09-10',
        amount: 226_811,
      },
      {
        date: '2036-03-10',
        amount: 226_811,
      },
      {
        date: '2036-09-10',
        amount: 226_811,
      },
      {
        date: '2037-03-10',
        amount: 226_811,
      },
      {
        date: '2037-09-10',
        amount: 226_811,
      },
      {
        date: '2038-03-10',
        amount: 226_811,
      },
      {
        date: '2038-09-10',
        amount: 226_811,
      },
      {
        date: '2039-03-10',
        amount: 226_811,
      },
      {
        date: '2039-09-10',
        amount: 226_811,
      },
    ],
  },
  {
    name: '국고01125-3909(19-6) 2',
    amount: 41_696_000,
    purchasePrice: 30_000_272,
    purchaseDate: '2022-08-25',
    maturityDate: '2039-09-10',
    coupons: [
      {
        date: '2022-09-10',
        amount: 234_540,
      },
      {
        date: '2023-03-10',
        amount: 234_540,
      },
      {
        date: '2023-09-10',
        amount: 234_540,
      },
      {
        date: '2024-03-10',
        amount: 234_540,
      },
      {
        date: '2024-09-10',
        amount: 234_540,
      },
      {
        date: '2025-03-10',
        amount: 234_540,
      },
      {
        date: '2025-09-10',
        amount: 234_540,
      },
      {
        date: '2026-03-10',
        amount: 234_540,
      },
      {
        date: '2026-09-10',
        amount: 234_540,
      },
      {
        date: '2027-03-10',
        amount: 234_540,
      },
      {
        date: '2027-09-10',
        amount: 234_540,
      },
      {
        date: '2028-03-10',
        amount: 234_540,
      },
      {
        date: '2028-09-10',
        amount: 234_540,
      },
      {
        date: '2029-03-10',
        amount: 234_540,
      },
      {
        date: '2029-09-10',
        amount: 234_540,
      },
      {
        date: '2030-03-10',
        amount: 234_540,
      },
      {
        date: '2030-09-10',
        amount: 234_540,
      },
      {
        date: '2031-03-10',
        amount: 234_540,
      },
      {
        date: '2031-09-10',
        amount: 234_540,
      },
      {
        date: '2032-03-10',
        amount: 234_540,
      },
      {
        date: '2032-09-10',
        amount: 234_540,
      },
      {
        date: '2033-03-10',
        amount: 234_540,
      },
      {
        date: '2033-09-10',
        amount: 234_540,
      },
      {
        date: '2034-03-10',
        amount: 234_540,
      },
      {
        date: '2034-09-10',
        amount: 234_540,
      },
      {
        date: '2035-03-10',
        amount: 234_540,
      },
      {
        date: '2035-09-10',
        amount: 234_540,
      },
      {
        date: '2036-03-10',
        amount: 234_540,
      },
      {
        date: '2036-09-10',
        amount: 234_540,
      },
      {
        date: '2037-03-10',
        amount: 234_540,
      },
      {
        date: '2037-09-10',
        amount: 234_540,
      },
      {
        date: '2038-03-10',
        amount: 234_540,
      },
      {
        date: '2038-09-10',
        amount: 234_540,
      },
      {
        date: '2039-03-10',
        amount: 234_540,
      },
      {
        date: '2039-09-10',
        amount: 234_540,
      },
    ],
  },
] as Bond<KRW>[];
