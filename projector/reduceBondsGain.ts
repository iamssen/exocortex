import type { BondsGain } from '../model/index.js';

export function reduceBondsGain(
  gain: BondsGain[],
  filterFromYear: number,
  reduceFromYear: number,
): {
  before: BondsGain[];
  after: Omit<BondsGain, 'year'> & { from: number; to: number };
} {
  const list = gain.filter(({ year }) => year >= filterFromYear);

  const index = list.findIndex(({ year }) => year >= reduceFromYear);
  const before: BondsGain[] = index !== -1 ? list.slice(0, index) : [];
  const after: BondsGain[] = index !== -1 ? list.slice(index) : list;

  return {
    before,
    after: after.reduce(
      (prev, { couponGain, maturityGain }) => {
        return {
          ...prev,
          couponGain: prev.couponGain + couponGain,
          maturityGain: prev.maturityGain + maturityGain,
        };
      },
      {
        from: reduceFromYear,
        to: after.at(-1)?.year ?? reduceFromYear,
        couponGain: 0,
        maturityGain: 0,
      },
    ),
  };
}
