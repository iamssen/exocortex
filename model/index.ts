import type { Iso8601 } from './nominal-types.ts';

export interface ExpiryData<T> {
  expires: Iso8601;
  refreshDate: Iso8601;
  data: T;
}

export interface VersionData<T> {
  version: string;
  refreshDate: Iso8601;
  data: T;
}

export * from './body/body.ts';

export * from './finance/base-rates.ts';
export * from './finance/benchmark.ts';
export * from './finance/quote.projection.ts';
export * from './finance/quote.ts';
export * from './finance/valuation.ts';

export * from './journal/journal.ts';

export * from './moneybook/moneybook.ts';

export * from './portfolio/balance.ts';
export * from './portfolio/bond.ts';
export * from './portfolio/deposit.ts';
export * from './portfolio/fx.ts';
export * from './portfolio/holding.ts';
export * from './portfolio/portfolio.ts';
export * from './portfolio/simulation.ts';
export * from './portfolio/trade.ts';
export * from './portfolio/watch.ts';

export * from './portfolio-summary/portfolio-summary.ts';

export * from './event.ts';
export * from './geolocation.ts';
export * from './link.ts';
export * from './nominal-types.ts';
export * from './rescuetime.ts';
export * from './weather.ts';
