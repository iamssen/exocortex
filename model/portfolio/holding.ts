import type { Trade } from './trade.js';

export interface Holding<Currency extends number = number> {
  symbol: string;
  avgCostPerShare: Currency;
  realizedGain: Currency;
  shares: number;
  prices: {
    minBuy: Currency;
    maxBuy: Currency;
    lastBuy: Currency;
    minSell?: Currency;
    maxSell?: Currency;
    lastSell?: Currency;
  };
  trades: Trade<Currency>[];
}

export interface Holdings<Currency extends number = number> {
  symbols: string[];
  holdSymbols: string[];
  list: Holding<Currency>[];
  trades: Trade<Currency>[];
}
