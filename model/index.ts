import type { Iso8601 } from './nominal-types.js';

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

export type Checked<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export * from './body/body.input.js';
export * from './body/body.js';

export * from './finance/base-rates.js';
export * from './finance/benchmark.js';
export * from './finance/quote.js';
export * from './finance/quote.projection.js';
export * from './finance/valuation.js';

export * from './finance-summary/summary.js';

export * from './journal/journal.js';

export * from './moneybook/moneybook.js';

export * from './portfolio/aggregate.js';
export * from './portfolio/balance.input.js';
export * from './portfolio/balance.js';
export * from './portfolio/bond.input.js';
export * from './portfolio/bond.js';
export * from './portfolio/deposit.input.js';
export * from './portfolio/deposit.js';
export * from './portfolio/fx.input.js';
export * from './portfolio/fx.js';
export * from './portfolio/fx.projection.js';
export * from './portfolio/holding.js';
export * from './portfolio/holding.projection.js';
export * from './portfolio/housing.input.js';
export * from './portfolio/portfolio.js';
export * from './portfolio/simulation.js';
export * from './portfolio/trade.js';
export * from './portfolio/trade.projection.js';
export * from './portfolio/watch.input.js';
export * from './portfolio/watch.js';

export * from './event.js';
export * from './geolocation.js';
export * from './links.js';
export * from './nominal-types.js';
export * from './rescuetime.js';
export * from './weather.js';
