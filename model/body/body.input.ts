import type { Iso8601 } from '../nominal-types.ts';

export interface KcalInput {
  [date: Iso8601]: {
    [meal: string]: {
      [food: string]: number;
    };
  };
}
