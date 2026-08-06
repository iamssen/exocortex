import type { KRW, USD } from '../nominal-types.ts';

export interface Simulation {
  title: string;
  usdkrw: KRW;
  jpykrw: KRW;
  spy: USD;
}
