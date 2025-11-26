import type { ASC, Iso8601, Ratio } from '../nominal-types.js';
import type {
  EquityValue,
  Quote,
  QuoteHistory,
  QuoteStatistics,
} from './quote.js';

export interface EquityValueRecord
  extends Omit<EquityValue, 'trailingPE'>,
    Required<Pick<EquityValue, 'trailingPE'>> {
  date: Iso8601;
}

export interface EquityValueHistory {
  records: ASC<EquityValueRecord>;
}

export type JoinedQuoteStatistics = Omit<QuoteStatistics, 'price'> &
  Quote & { fiftyTwoWeekPosition?: Ratio };

export type JoinedQuoteHistory = QuoteHistory & { quote?: Quote } & {
  fiftyTwoWeekPosition: Ratio;
};
