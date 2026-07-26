import type { Ratio } from '../nominal-types';

export type Watch = Array<
  | { high_price: number }
  | { low_price: number }
  | { high_pe: Ratio }
  | { low_pe: Ratio }
  | { high_52week: Ratio }
  | { low_52week: Ratio }
>;
