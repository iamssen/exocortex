import type { Iso8601, Ratio } from '../nominal-types.js';

export interface DV<T> {
  date: Iso8601;
  value: T;
}

export interface KospiPeItem {
  'date': Iso8601;
  'all': Ratio;
  '200': Ratio;
  '100': Ratio;
  '50': Ratio;
  'manufacturing': Ratio;
}

export interface InterestRateItem {
  date: Iso8601;
  value: Ratio;
}

export interface RecessionItem {
  from: Iso8601;
  to: Iso8601;
}

export type FearAndGreedRating =
  | 'extreme fear'
  | 'fear'
  | 'neutral'
  | 'greed'
  | 'extreme greed';

export interface FearAndGreedItem {
  date: Iso8601;
  value: number;
  rating: FearAndGreedRating;
}

export interface FearAndGreed {
  link: string;
  rating: FearAndGreedRating;
  date: Iso8601;
  fearAndGreed: FearAndGreedItem[];
  marketMomentumSP500: FearAndGreedItem[];
  marketMomentumSP125: FearAndGreedItem[];
  stockPriceStrength: FearAndGreedItem[];
  stockPriceBreadth: FearAndGreedItem[];
  putCallOptions: FearAndGreedItem[];
  marketVolatilityVIX: FearAndGreedItem[];
  marketVolatilityVIX50: FearAndGreedItem[];
  junkBondDemand: FearAndGreedItem[];
  safeHavenDemand: FearAndGreedItem[];
}
