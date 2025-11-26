import type { Ratio } from '../nominal-types';

export type Watch = Array<
  | { high_price: number }
  | { low_price: number }
  | { high_pe: Ratio }
  | { low_pe: Ratio }
  | { high_52week: Ratio }
  | { low_52week: Ratio }
>;

export type Match = Array<
  | { match: boolean; high_price: number; current_price?: number }
  | { match: boolean; low_price: number; current_price?: number }
  | { match: boolean; high_pe: Ratio; current_pe?: Ratio }
  | { match: boolean; low_pe: Ratio; current_pe?: Ratio }
  | { match: boolean; high_52week: Ratio; current_52week?: Ratio }
  | { match: boolean; low_52week: Ratio; current_52week?: Ratio }
>;
