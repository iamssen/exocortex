import type { Iso8601 } from '../nominal-types.js';

export interface KcalInput {
  [date: Iso8601]: {
    [meal: string]: {
      [food: string]: number;
    };
  };
}
