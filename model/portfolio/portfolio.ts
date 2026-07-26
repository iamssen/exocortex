import type { QuoteInfo } from '../finance/quote.js';
import type { Iso8601, JPY, KRW, USD } from '../nominal-types.js';
import type { Balances } from './balance.js';
import type { Bonds } from './bond.js';
import type { Deposits } from './deposit.js';
import type { FX } from './fx.js';
import type { Holding, Holdings } from './holding.js';
import type { Simulation } from './simulation.js';
import type { Watch } from './watch.js';

export type PortfolioMarket = 'us' | 'kr' | 'jp' | 'fx' | 'crypto';

export interface QuoteInfoIndex {
  quotes: QuoteInfo[];
  symbols: { [symbol: string]: number | undefined };
  naverSymbols: { [symbol: string]: number | undefined };
  yahooSymbols: { [symbol: string]: number | undefined };
  googleSymbols: { [symbol: string]: number | undefined };
  trades: {
    [symbol: string]: PortfolioMarket | undefined;
  };
}

export interface Portfolio {
  date: Iso8601;

  balances: {
    krw: Balances<KRW>;
    usd: Balances<USD>;
    jpy: Balances<JPY>;
    others: Record<string, Balances>;
  };

  housing: Balances<KRW>;

  deposits: {
    kr: Deposits<KRW>;
  };

  bonds: {
    kr: Bonds<KRW>;
    us: Bonds<USD>;
  };

  fx: {
    usd: FX<USD>;
    jpy: FX<JPY>;
  };

  holdings: {
    kr: Holdings<KRW>;
    us: Holdings<USD>;
    jp: Holdings<JPY>;
    crypto: Holdings<USD>;

    fx: Holdings<KRW>; // balance + fx
    index: { [symbol: string]: Holding | undefined };
  };

  watches: { [symbol: string]: Watch };

  simulations: Simulation[];
}
