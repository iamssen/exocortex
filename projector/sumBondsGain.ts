import { DateTime } from 'luxon';
import type { Bond, Iso8601 } from '../model/index.js';

export function sumBondsGain<T extends number>(
  bonds: Bond<T>[],
  fromDate: Iso8601,
  toDate: Iso8601,
): { maturityGain: T; couponsGain: T } {
  let maturityGain = 0;
  let couponsGain = 0;

  const from = DateTime.fromISO(fromDate).startOf('day').toMillis();
  const to = DateTime.fromISO(toDate).endOf('day').toMillis();

  let i: number = bonds.length;
  while (--i >= 0) {
    const { maturityDate, purchasePrice, amount, coupons } = bonds[i];
    const maturity = new Date(maturityDate).getTime();

    if (maturity > from && maturity < to) {
      maturityGain += amount - purchasePrice;
    }

    let j: number = coupons.length;
    while (--j >= 0) {
      const { date, amount: couponAmount } = coupons[j];
      const d = new Date(date).getTime();

      if (d > from && d < to) {
        couponsGain += couponAmount;
      }
    }
  }

  return { maturityGain, couponsGain } as { maturityGain: T; couponsGain: T };
}
