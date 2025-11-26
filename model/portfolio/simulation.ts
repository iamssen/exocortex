import type { KRW, USD } from '../nominal-types.js';

export interface Simulation {
  title: string;
  usdkrw: KRW;
  jpykrw: KRW;
  spy: USD;
}
