import type { Gain } from '../model/index.js';
import { fillPercentToGain } from './helpers/fillPercentToGain.js';

export function sumGain(...gains: Gain[]): Gain {
  // total gain
  const totalGain: Omit<
    Gain,
    'totalGainPercent' | 'daysGainPercent' | 'sharesGainPercent'
  > = {
    sharesGain: 0,
    realizedGain: 0,
    daysGain: 0,
    totalGain: 0,
    marketValue: 0,
  };

  let i: number = gains.length;
  while (--i >= 0) {
    const g = gains[i];
    if (g) {
      totalGain.sharesGain += g.sharesGain;
      totalGain.realizedGain += g.realizedGain;
      totalGain.daysGain += g.daysGain;
      totalGain.totalGain += g.totalGain;
      totalGain.marketValue += g.marketValue;
    }
  }

  return fillPercentToGain(totalGain);
}
