import type { HistoryMatch } from '../date-utils/index.js';
import type {
  CentralBank,
  CurrentMarketValuation,
  DV,
  EquityValueHistory,
  ExpiryData,
  FearAndGreed,
  InterestRateItem,
  KospiPeItem,
  PeAndYields,
  Quote,
  QuoteEtfHoldings,
  QuoteHistory,
  QuoteRecord,
  QuoteStatistics,
  Ratio,
  RecessionItem,
  USD,
  VersionData,
} from '../model/index.js';
import type { API } from './types.js';

export type FinanceAPI = [
  API<
    '중앙은행 기준금리',
    '/finance/base-rates/:bank',
    `finance/base-rates/${CentralBank}`,
    ExpiryData<InterestRateItem[]>
  >,
  API<
    'Quote',
    '/finance/quote/:symbol',
    `finance/quote/${string}`,
    ExpiryData<Quote>
  >,
  API<
    'Quote Statistics',
    '/finance/quote-statistics/:symbol',
    `finance/quote-statistics/${string}`,
    ExpiryData<QuoteStatistics>
  >,
  API<
    'ETF에 포함된 주식들',
    '/finance/quote-etf-holdings/:symbol',
    `finance/quote-etf-holdings/${string}`,
    ExpiryData<QuoteEtfHoldings>
  >,
  API<
    'Quote History',
    '/finance/quote-history/:symbol',
    `finance/quote-history/${string}`,
    ExpiryData<QuoteHistory>
  >,
  API<
    '[성능 최적화] Quote history에서 1W, 1M, 10Y... 와 같이 특정 과거 시점의 데이터를 추출해놓은 데이터',
    '/finance/quote-history-summary/:symbol',
    `finance/quote-history-summary/${string}`,
    VersionData<HistoryMatch<QuoteRecord>[]>
  >,
  API<
    'P/E History Chart의 Data Set: (Quote > EquityValue).trailingPE가 명확히 주입된 History 기록',
    '/finance/equity-value-history/:symbol',
    `finance/equity-value-history/${string}`,
    VersionData<EquityValueHistory>
  >,
  API<
    'KOSPI P/E',
    '/finance/:benchmark',
    `finance/kospi-pe`,
    ExpiryData<KospiPeItem[]>
  >,
  API<
    'Fear and Greed',
    '/finance/:benchmark',
    `finance/fear-and-greed`,
    ExpiryData<FearAndGreed>
  >,
  API<
    'Shiller P/E, SP500 P/E',
    '/finance/:benchmark',
    `finance/${'shiller-pe' | 'sp500-pe'}`,
    ExpiryData<DV<Ratio>[]>
  >,
  API<
    'SP500 Earnings',
    '/finance/:benchmark',
    `finance/sp500-earnings`,
    ExpiryData<DV<USD>[]>
  >,
  API<
    'Margin Debt, Buffett Indicator',
    '/finance/:benchmark',
    `finance/${'margin-debt' | 'buffett-indicator'}`,
    ExpiryData<CurrentMarketValuation>
  >,
  API<
    'Recession',
    '/finance/:benchmark',
    `finance/recession`,
    ExpiryData<RecessionItem[]>
  >,
  API<
    'PE and Yields',
    '/finance/:benchmark',
    `finance/pe-and-yields`,
    ExpiryData<PeAndYields[]>
  >,
  API<
    'Fred에서 가져오는 데이터',
    '/finance/fred/:series',
    `finance/fred/${string}`,
    ExpiryData<DV<number>[]>
  >,
];
