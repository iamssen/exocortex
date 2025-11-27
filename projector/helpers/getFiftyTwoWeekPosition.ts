import type { Ratio } from '../../model/index.js';

export function getFiftyTwoWeekPosition(
  price: number,
  fiftyTwoWeekRange: { low: number; high: number },
): Ratio {
  return ((price - fiftyTwoWeekRange.low) /
    (fiftyTwoWeekRange.high - fiftyTwoWeekRange.low)) as Ratio;
}
