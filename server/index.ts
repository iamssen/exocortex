import type { FinanceAPI } from './finance.js';
import type { MyAPI } from './my.js';
import type { UtilsAPI } from './utils.js';

export type APIConfig = [...FinanceAPI, ...MyAPI, ...UtilsAPI];
