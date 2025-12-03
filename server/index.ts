import type { FinanceAPI } from './finance.js';
import type { MyAPI } from './my.js';
import type { UtilsAPI } from './utils.js';

export type APIConfig = [...FinanceAPI, ...MyAPI, ...UtilsAPI];

type RouterPathOf<T extends APIConfig> = {
  [K in keyof T]: T[K]['__routerPath__'];
};

export type Routes = {
  [P in APIConfig[number] as P['__apiPath__']]: {
    description: P['__description__'];
    data: P['__data__'];
    query: P['__query__'];
  };
};

export const requiredAPIRoutes: RouterPathOf<APIConfig> = [
  '/finance/quotes',
  '/finance/base-rates/:bank',
  '/finance/quote/:symbol',
  '/finance/quote-statistics/:symbol',
  '/finance/quote-etf-holdings/:symbol',
  '/finance/quote-history/:symbol',
  '/finance/quote-history-summary/:symbol',
  '/finance/equity-value-history/:symbol',
  '/finance/:benchmark',
  '/finance/:benchmark',
  '/finance/:benchmark',
  '/finance/:benchmark',
  '/finance/:benchmark',
  '/finance/:benchmark',
  '/finance/:benchmark',
  '/finance/fred/:series',
  '/my/position/:position',
  '/my/portfolio',
  '/my/body',
  '/my/journal',
  '/my/moneybook',
  '/my/summary',
  '/my/life-indicator',
  '/my/finance-indicator',
  '/my/skin-indicator',
  '/my/links',
  '/my/refs',
  '/my/rescuetime',
  '/my/rescuetime/:date',
  '/reverse-geocoding',
  '/weather',
];
