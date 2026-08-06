import type { Iso8601, Percent } from './nominal-types.ts';

export type PrecipitationType = 'NONE' | 'UNKNOWN' | 'RAIN' | 'SNOW';

export interface Weather {
  baseDate: Iso8601;
  temperature: number; // T1H, ℃
  rainfall: number; // RN1, mm
  humidity: Percent; // REH, %
  precipitationType: PrecipitationType; // PTY
}
