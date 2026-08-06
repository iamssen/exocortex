import type { ASC, Iso8601 } from '../nominal-types.ts';
import type { EquityValue } from './quote.ts';

export interface EquityValueRecord
  extends
    Omit<EquityValue, 'trailingPE'>,
    Required<Pick<EquityValue, 'trailingPE'>> {
  date: Iso8601;
}

export interface EquityValueHistory {
  records: ASC<EquityValueRecord>;
}
