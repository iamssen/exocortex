import { describe, expect, test } from 'vitest';
import type { Deposit, Iso8601, KRW } from '../../model/index.js';
import { sumDepositsGain } from '../sumDepositsGain.js';

describe('sumDepositsGain()', () => {
  test('should match deposits gain', () => {
    expect(
      sumDepositsGain(
        deposits,
        '2023-10-01' as Iso8601,
        '2024-01-31' as Iso8601,
      ).interestGain,
    ).toBe(4_238_460 + 3_807_000);
  });
});

const deposits = [
  {
    name: 'K뱅크 예금',
    amount: 100_000_000,
    start: '2023-06-25',
    end: '2023-09-25',
    interest: 3.3,
    tax: 15.4,
    interestIncome: 703_686,
  },
  {
    name: '국민은행 예금',
    amount: 100_000_000,
    start: '2022-11-19',
    end: '2023-11-19',
    interest: 5.01,
    tax: 15.4,
    interestIncome: 4_238_460,
  },
  {
    name: '카카오뱅크 예금 24',
    amount: 100_000_000,
    start: '2023-01-22',
    end: '2024-01-22',
    interest: 4.5,
    tax: 15.4,
    interestIncome: 3_807_000,
  },
  {
    name: '국민은행 청약',
    amount: 5_000_000,
    start: '2023-02-08',
    end: '2024-02-08',
    interest: 2.6,
    tax: 15.4,
    interestIncome: 109_980,
  },
  {
    name: '카카오뱅크 예금 25',
    amount: 100_000_000,
    start: '2023-01-22',
    end: '2025-01-22',
    interest: 4.55,
    tax: 15.4,
    interestIncome: 7_709_146,
  },
  {
    name: '카카오뱅크 예금 26',
    amount: 100_000_000,
    start: '2023-01-22',
    end: '2026-01-22',
    interest: 4.6,
    tax: 15.4,
    interestIncome: 11_685_461,
  },
] as Deposit<KRW>[];
