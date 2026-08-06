import type { KRW } from '../nominal-types.ts';
import type { Trade } from './trade.ts';

export interface FX<Currency extends number = number> {
  symbol: string;
  purchaseAmount: Currency;
  avgExchangeRate: KRW;
  realizedGain: KRW;
  prices: {
    minBuy: KRW;
    maxBuy: KRW;
    lastBuy: KRW;
    minSell?: KRW;
    maxSell?: KRW;
    lastSell?: KRW;
  };
  trades: Trade<KRW>[];
}
