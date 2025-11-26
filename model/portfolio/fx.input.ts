import type { Iso8601, KRW } from '../nominal-types.js';

export type FXInput = Array<{
  date: Iso8601;
  price: KRW;
  quantity: number;
}>;
