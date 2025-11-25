import type {
  Iso8601,
  JPY,
  KRW,
  Percent,
  Ratio,
  USD,
} from './nominal-types.js';
import type { QuoteInfo } from './quote.js';

export type Portfolio = 'us' | 'kr' | 'jp' | 'fx' | 'crypto';
export type AnalyzedQuoteInfo = QuoteInfo & {
  portfolio: Portfolio | undefined;
};

export interface QuoteInfoIndex {
  quotes: QuoteInfo[];
  symbols: { [symbol: string]: number | undefined };
  naverSymbols: { [symbol: string]: number | undefined };
  yahooSymbols: { [symbol: string]: number | undefined };
  googleSymbols: { [symbol: string]: number | undefined };
  trades: {
    [symbol: string]: Portfolio | undefined;
  };
}

export interface Balance<Currency extends number = number> {
  name: string;
  amount: Currency;
}

export interface Balances<Currency extends number = number> {
  totalAmount: Currency;
  list: Balance<Currency>[];
}

export interface Bond<Currency extends number = number> {
  name: string;
  amount: Currency;
  purchasePrice: Currency;
  purchaseDate: Iso8601;
  maturityDate: Iso8601;
  coupons: Array<{
    date: Iso8601;
    amount: Currency;
  }>;
}

export interface BondsGain {
  year: number;
  maturityGain: number;
  couponGain: number;
}

export interface Bonds<Currency extends number = number> {
  totalAmount: Currency;
  totalPurchasePrice: Currency;
  list: Bond<Currency>[];
  gain: BondsGain[];
}

export interface Holding<Currency extends number = number> {
  symbol: string;
  avgCostPerShare: Currency;
  realizedGain: Currency;
  shares: number;
  prices: {
    minBuy: Currency;
    maxBuy: Currency;
    lastBuy: Currency;
    minSell?: Currency;
    maxSell?: Currency;
    lastSell?: Currency;
  };
  trades: Trade<Currency>[];
}

export interface Holdings<Currency extends number = number> {
  symbols: string[];
  holdSymbols: string[];
  list: Holding<Currency>[];
  trades: Trade<Currency>[];
}

export interface FX<Currency extends number = number> {
  symbol: string;
  purchaseAmount: Currency;
  avgExchangeRate: KRW;
  realizedGain: KRW;
  prices: {
    minBuy: KRW;
    maxBuy: KRW;
    lastBuy: KRW;
    minSell?: KRW;
    maxSell?: KRW;
    lastSell?: KRW;
  };
  trades: Trade<KRW>[];
}

export interface Deposit<Currency extends number = number> {
  name: string;
  amount: Currency;
  start: Iso8601;
  end: Iso8601;
  interest: Percent;
  tax: Percent;
  interestIncome: Currency;
}

export interface DepositsGain {
  year: number;
  interestGain: number;
}

export interface Deposits<Currency extends number = number> {
  totalAmount: Currency;
  list: Deposit<Currency>[];
  gain: DepositsGain[];
}

export interface Trade<Currency extends number = number> {
  symbol: string;
  date: Iso8601;
  price: Currency;
  quantity: number;
  comment?: string;
}

export type Watch = Array<
  | { high_price: number }
  | { low_price: number }
  | { high_pe: Ratio }
  | { low_pe: Ratio }
  | { high_52week: Ratio }
  | { low_52week: Ratio }
>;

export interface Simulation {
  title: string;
  usdkrw: number;
  jpykrw: number;
  spy: number;
}

export type Match = Array<
  | { match: boolean; high_price: number; current_price?: number }
  | { match: boolean; low_price: number; current_price?: number }
  | { match: boolean; high_pe: Ratio; current_pe?: Ratio }
  | { match: boolean; low_pe: Ratio; current_pe?: Ratio }
  | { match: boolean; high_52week: Ratio; current_52week?: Ratio }
  | { match: boolean; low_52week: Ratio; current_52week?: Ratio }
>;

export interface FinanceData {
  date: Iso8601;

  balances: {
    krw: Balances<KRW>;
    usd: Balances<USD>;
    jpy: Balances<JPY>;
    others: Record<string, Balances>;
  };

  housing: Balances<KRW>;

  deposits: {
    kr: Deposits<KRW>;
  };

  bonds: {
    kr: Bonds<KRW>;
    us: Bonds<USD>;
  };

  fx: {
    usd: FX<USD>;
    jpy: FX<JPY>;
  };

  holdings: {
    kr: Holdings<KRW>;
    us: Holdings<USD>;
    jp: Holdings<JPY>;
    crypto: Holdings<USD>;

    fx: Holdings<KRW>; // balance + fx
    index: { [symbol: string]: Holding | undefined };
  };

  watches: { [symbol: string]: Watch };

  simulations: Simulation[];
}
