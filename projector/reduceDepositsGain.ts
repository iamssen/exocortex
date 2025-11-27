import type { DepositsGain } from '../model/index.js';

export function reduceDepositsGain(
  gain: DepositsGain[],
  filterFromYear: number,
  reduceFromYear: number,
): {
  before: DepositsGain[];
  after: Omit<DepositsGain, 'year'> & { from: number; to: number };
} {
  const list = gain.filter(({ year }) => year >= filterFromYear);

  const index = list.findIndex(({ year }) => year >= reduceFromYear);
  const before: DepositsGain[] = index !== -1 ? list.slice(0, index) : [];
  const after: DepositsGain[] = index !== -1 ? list.slice(index) : list;

  return {
    before,
    after: after.reduce(
      (prev, { interestGain }) => {
        return {
          ...prev,
          interestGain: prev.interestGain + interestGain,
        };
      },
      {
        from: reduceFromYear,
        to: after.at(-1)?.year ?? reduceFromYear,
        interestGain: 0,
      },
    ),
  };
}
