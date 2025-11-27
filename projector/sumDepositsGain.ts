import { DateTime } from 'luxon';
import type { Deposit, Iso8601 } from '../model/index.js';

export function sumDepositsGain<T extends number>(
  deposits: Deposit<T>[],
  fromDate: Iso8601,
  toDate: Iso8601,
): { interestGain: T } {
  let interestGain = 0;

  const from = DateTime.fromISO(fromDate).startOf('day').toMillis();
  const to = DateTime.fromISO(toDate).endOf('day').toMillis();

  let i: number = deposits.length;
  while (--i >= 0) {
    const { end: endDate, interestIncome } = deposits[i];
    const end = new Date(endDate).getTime();

    if (end > from && end < to) {
      interestGain += interestIncome;
    }
  }

  return { interestGain } as { interestGain: T };
}
