import type { Gain, Percent } from '../../model/index.js';

export function fillPercentToGain({
  daysGain,
  totalGain,
  sharesGain,
  realizedGain,
  marketValue,
}: Omit<
  Gain,
  'sharesGainPercent' | 'daysGainPercent' | 'totalGainPercent'
>): Gain {
  return {
    sharesGain,
    sharesGainPercent: gainPercent(sharesGain, marketValue),
    realizedGain,
    daysGain,
    daysGainPercent: gainPercent(daysGain, marketValue),
    totalGain,
    totalGainPercent: gainPercent(totalGain, marketValue),
    marketValue,
  };
}

function gainPercent(gain: number, marketValue: number): Percent {
  const p = (gain / (marketValue - gain)) * 100;

  return Number.isNaN(p) ? (0 as Percent) : (p as Percent);
}
