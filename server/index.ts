import type { FinanceAPI } from './finance.ts';
import type { MyAPI } from './my.ts';
import type { UtilsAPI } from './utils.ts';

export type APIConfig = [...FinanceAPI, ...MyAPI, ...UtilsAPI];
