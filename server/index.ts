import type { FinanceAPI } from './finance.js';
import type { MyAPI } from './my.js';
import type { UtilsAPI } from './utils.js';

export type APIConfig = [...FinanceAPI, ...MyAPI, ...UtilsAPI];

export type Routes = {
  [P in APIConfig[number] as P['__apiPath__']]: {
    description: P['__description__'];
    data: P['__data__'];
    query: P['__query__'];
  };
};
