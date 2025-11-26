import type { Iso8601 } from './nominal-types.js';

interface Range {
  name: string;
  from: Iso8601;
  to: Iso8601;
}

interface Spot {
  name: string;
  date: Iso8601;
}

export type EventIndicator = Range | Spot;
