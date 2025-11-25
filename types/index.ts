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

export * from './nominal-types.js';

export * from './aggregate.js';
export * from './benchmark.js';
export * from './finance-data.js';
export * from './join.js';
export * from './links.js';
export * from './quote.js';
export * from './summary.js';
export * from './valuation.js';

export * from './body.js';
export * from './event.js';
export * from './moneybook.js';
export * from './rescuetime.js';

export * from './journal.js';
