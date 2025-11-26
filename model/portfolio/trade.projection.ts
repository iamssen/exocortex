import type { Quote } from '../finance/quote.js';
import type { Trade } from './trade.js';

export interface JoinedTrade {
  isFirstAppearedDate?: true;
  trade: Trade;
  quote?: Quote;
}
