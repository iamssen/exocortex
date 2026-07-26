import type { ASC, Iso8601 } from '../nominal-types.js';
import type { EquityValue } from './quote.js';

export interface EquityValueRecord
  extends
    Omit<EquityValue, 'trailingPE'>,
    Required<Pick<EquityValue, 'trailingPE'>> {
  date: Iso8601;
}

export interface EquityValueHistory {
  records: ASC<EquityValueRecord>;
}
