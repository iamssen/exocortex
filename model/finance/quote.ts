import type {
  ASC,
  Iso8601,
  Percent,
  Ratio,
  Timezone,
} from '../nominal-types.js';

export type QuoteType =
  | 'CURRENCY'
  | 'EQUITY'
  | 'ETF'
  | 'CRYPTOCURRENCY'
  | 'INDEX';

export type StockExchangeCode = 'KS' | 'KQ' | 'NYS' | 'NSQ' | 'TYO' | 'AMX';

export type MarketState = 'REGULAR' | 'CLOSED' | 'PRE';

export interface PlatformMap {
  yahoo?: string;
  google?: string;
  naver?: string;
  binance?: string;
  upbit?: string;
}

export interface QuoteInfo {
  type: QuoteType;
  currency: string;
  symbol: string;
  displayName: string;
  stockExchangeCode?: StockExchangeCode;
  timezone: Timezone;

  symbols: PlatformMap;
  links: PlatformMap;

  forceDependsOn?: 'yahoo';
}

export interface Quote extends QuoteInfo {
  time: Iso8601;
  marketState: MarketState;
  price: number;
  change: number;
  changePercent: Percent;
  previousClose: number;
  source: unknown;
}

export interface QuoteRecord {
  date: Iso8601;
  high: number;
  low: number;
  open: number;
  close: number;
}

export interface QuoteHistory {
  fiftyTwoWeekRange: {
    low: number;
    high: number;
  };

  records: ASC<QuoteRecord>;
}

export interface EquityValue {
  /** EPS = Price / PER */
  epsTrailingTwelveMonths?: number;

  /** PER = Price / EPS */
  trailingPE?: Ratio;

  /** Consensus EPS */
  epsForward?: number;

  /** Consensus PER */
  forwardPE?: Ratio;

  /** BPS = Price / PBR */
  bookValue?: number;

  /** PBR = Price / BPS */
  priceToBook?: Ratio;

  returnOnAssets?: Ratio;

  returnOnEquity?: Ratio;
}

export interface QuoteStatistics extends QuoteInfo, EquityValue {
  /**
   * Price = PER * EPS
   * Price = PBR * BPS
   */
  price?: number;

  fiftyTwoWeekRange?: {
    low: number;
    high: number;
  };

  beta?: Ratio;
}

export interface QuoteEtfHolding {
  info?: QuoteInfo;
  name: string;
  weight: Ratio;
}

export interface QuoteEtfHoldings extends QuoteInfo {
  holdings?: QuoteEtfHolding[];
}
