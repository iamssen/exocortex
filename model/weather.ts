import type { Iso8601, Percent } from './nominal-types.js';

export type PrecipitationType = 'NONE' | 'UNKNOWN' | 'RAIN' | 'SNOW';

export interface Weather {
  baseDate: Iso8601;
  termperature: number; // T1H, ℃
  rainfall: number; // RN1, mm
  humidity: Percent; // REH, %
  precipitationType: PrecipitationType; // PTY
}
