import type { Iso8601 } from '../nominal-types.js';

export interface Trade<Currency extends number = number> {
  symbol: string;
  date: Iso8601;
  price: Currency;
  quantity: number;
  comment?: string;
}
