import type {
  CentralBank,
  CurrentMarketValuation,
  DV,
  EquityValueHistory,
  ExpiryData,
  FearAndGreed,
  InterestRateItem,
  PeAndYields,
  Quote,
  QuoteEtfHoldings,
  QuoteHistory,
  QuoteInfoIndex,
  QuoteStatistics,
  Ratio,
  RecessionItem,
  USD,
  VersionData
} from '../model/index.ts';
import type { API } from './types.ts';

export type FinanceAPI = [
  API<
    'Quotes',
    '/finance/quotes',
    'finance/quotes',
    VersionData<QuoteInfoIndex>
  >,
  API<
    '중앙은행 기준금리',
    '/finance/base-rates/:bank',
    `finance/base-rates/${CentralBank}`,
    ExpiryData<InterestRateItem[]>,
    { cacheOnly?: boolean }
  >,
  API<
    'Quote',
    '/finance/quote/:symbol',
    `finance/quote/${string}`,
    ExpiryData<Quote>,
    { cacheOnly?: boolean }
  >,
  API<
    'Quote Statistics',
    '/finance/quote-statistics/:symbol',
    `finance/quote-statistics/${string}`,
    ExpiryData<QuoteStatistics>,
    { cacheOnly?: boolean }
  >,
  API<
    'ETF에 포함된 주식들',
    '/finance/quote-etf-holdings/:symbol',
    `finance/quote-etf-holdings/${string}`,
    ExpiryData<QuoteEtfHoldings>,
    { cacheOnly?: boolean }
  >,
  API<
    'Quote History',
    '/finance/quote-history/:symbol',
    `finance/quote-history/${string}`,
    ExpiryData<QuoteHistory>,
    { cacheOnly?: boolean }
  >,
  API<
    'P/E History Chart의 Data Set: (Quote > EquityValue).trailingPE가 명확히 주입된 History 기록',
    '/finance/equity-value-history/:symbol',
    `finance/equity-value-history/${string}`,
    VersionData<EquityValueHistory>,
    { cacheOnly?: boolean }
  >,
  // API<
  //   'KOSPI P/E',
  //   '/finance/:benchmark',
  //   `finance/kospi-pe`,
  //   ExpiryData<KospiPeItem[]>,
  //   { cacheOnly?: boolean }
  // >,
  API<
    'Fear and Greed',
    '/finance/:benchmark',
    `finance/fear-and-greed`,
    ExpiryData<FearAndGreed>,
    { cacheOnly?: boolean }
  >,
  API<
    'Shiller P/E, SP500 P/E, Kospi P/E',
    '/finance/:benchmark',
    `finance/${'shiller-pe' | 'sp500-pe' | 'kospi-pe'}`,
    ExpiryData<DV<Ratio>[]>,
    { cacheOnly?: boolean }
  >,
  API<
    'SP500 Earnings',
    '/finance/:benchmark',
    `finance/sp500-earnings`,
    ExpiryData<DV<USD>[]>,
    { cacheOnly?: boolean }
  >,
  API<
    'Margin Debt, Buffett Indicator',
    '/finance/:benchmark',
    `finance/${'margin-debt' | 'buffett-indicator'}`,
    ExpiryData<CurrentMarketValuation>,
    { cacheOnly?: boolean }
  >,
  API<
    'Recession',
    '/finance/:benchmark',
    `finance/recession`,
    ExpiryData<RecessionItem[]>,
    { cacheOnly?: boolean }
  >,
  API<
    'PE and Yields',
    '/finance/:benchmark',
    `finance/pe-and-yields`,
    ExpiryData<PeAndYields[]>,
    { cacheOnly?: boolean }
  >,
  API<
    'Fred에서 가져오는 데이터',
    '/finance/fred/:series',
    `finance/fred/${string}`,
    ExpiryData<DV<number>[]>,
    { cacheOnly?: boolean }
  >,
];
