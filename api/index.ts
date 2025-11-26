import type { HistoryMatch } from '../date-utils/index.js';
import type {
  Body,
  CentralBank,
  CurrentMarketValuation,
  DV,
  EquityValueHistory,
  EventIndicator,
  ExpiryData,
  FearAndGreed,
  InterestRateItem,
  Journal,
  KospiPeItem,
  Link,
  Moneybook,
  PeAndYields,
  Portfolio,
  Quote,
  QuoteEtfHoldings,
  QuoteHistory,
  QuoteInfoIndex,
  QuoteRecord,
  QuoteStatistics,
  Ratio,
  RecessionItem,
  Rescuetime,
  RescuetimeActivity,
  ReverseGeocoding,
  Summaries,
  USD,
  VersionData,
  Weather,
} from '../model/index.js';

type APIConfigItem<
  RouterPath extends string,
  APIPath extends string,
  T,
  Q = {},
> = RouterPath & {
  __data__: T;
  __apiPath__: APIPath;
  __routerPath__: RouterPath;
  __query__: Q;
};

type StaticFileConfigItem<APIPath extends string, T> = APIPath & {
  __data__: T;
  __apiPath__: APIPath;
};

type APIConfig = [
  APIConfigItem<
    '/finance/base-rates/:bank',
    `finance/base-rates/${CentralBank}`,
    ExpiryData<InterestRateItem[]>
  >,
  APIConfigItem<
    '/finance/quote/:symbol',
    `finance/quote/${string}`,
    ExpiryData<Quote>
  >,
  APIConfigItem<
    '/finance/quote-statistics/:symbol',
    `finance/quote-statistics/${string}`,
    ExpiryData<QuoteStatistics>
  >,
  APIConfigItem<
    '/finance/quote-etf-holdings/:symbol',
    `finance/quote-etf-holdings/${string}`,
    ExpiryData<QuoteEtfHoldings>
  >,
  APIConfigItem<
    '/finance/quote-history/:symbol',
    `finance/quote-history/${string}`,
    ExpiryData<QuoteHistory>
  >,
  APIConfigItem<
    '/finance/quote-history-summary/:symbol',
    `finance/quote-history-summary/${string}`,
    VersionData<HistoryMatch<QuoteRecord>[]>
  >,
  APIConfigItem<
    '/finance/equity-value-history/:symbol',
    `finance/equity-value-history/${string}`,
    VersionData<EquityValueHistory>
  >,
  APIConfigItem<
    '/finance/:benchmark',
    `finance/kospi-pe`,
    ExpiryData<KospiPeItem[]>
  >,
  APIConfigItem<
    '/finance/:benchmark',
    `finance/fear-and-greed`,
    ExpiryData<FearAndGreed>
  >,
  APIConfigItem<
    '/finance/:benchmark',
    `finance/${'shiller-pe' | 'sp500-pe'}`,
    ExpiryData<DV<Ratio>[]>
  >,
  APIConfigItem<
    '/finance/:benchmark',
    `finance/sp500-earnings`,
    ExpiryData<DV<USD>[]>
  >,
  APIConfigItem<
    '/finance/:benchmark',
    `finance/${'margin-debt' | 'buffett-indicator'}`,
    ExpiryData<CurrentMarketValuation>
  >,
  APIConfigItem<
    '/finance/:benchmark',
    `finance/recession`,
    ExpiryData<RecessionItem[]>
  >,
  APIConfigItem<
    '/finance/:benchmark',
    `finance/pe-and-yields`,
    ExpiryData<PeAndYields[]>
  >,
  APIConfigItem<
    '/finance/fred/:series',
    `finance/fred/${string}`,
    ExpiryData<DV<number>[]>
  >,
  APIConfigItem<
    '/my/position/:position',
    `my/position/${string}`,
    string // Markdown
  >,
  APIConfigItem<'/my/finance', `my/finance`, VersionData<Portfolio>>,
  APIConfigItem<'/my/body', `my/body`, VersionData<Body>>,
  APIConfigItem<'/my/journal', `my/journal`, VersionData<Journal>>,
  APIConfigItem<'/my/moneybook', `my/moneybook`, VersionData<Moneybook>>,
  APIConfigItem<'/my/summary', `my/summary`, VersionData<Summaries>>,
  APIConfigItem<
    '/my/life-indicator',
    `my/life-indicator`,
    VersionData<EventIndicator[]>
  >,
  APIConfigItem<
    '/my/finance-indicator',
    `my/finance-indicator`,
    VersionData<EventIndicator[]>
  >,
  APIConfigItem<
    '/my/skin-indicator',
    `my/skin-indicator`,
    VersionData<EventIndicator[]>
  >,
  APIConfigItem<'/my/links', `my/links`, VersionData<Link[]>>,
  APIConfigItem<'/my/refs', `my/refs`, VersionData<Link[]>>,
  APIConfigItem<'/my/rescuetime', `my/rescuetime`, ExpiryData<Rescuetime>>,
  APIConfigItem<
    '/my/rescuetime/:date',
    `my/rescuetime/${string}`,
    RescuetimeActivity[]
  >,
  APIConfigItem<
    '/reverse-geocoding',
    `reverse-geocoding`,
    ReverseGeocoding,
    {
      longitude: number;
      latitude: number;
    }
  >,
  APIConfigItem<
    '/weather',
    `weather`,
    Weather,
    {
      longitude: number;
      latitude: number;
    }
  >,
];

type StaticFileConfig = [
  StaticFileConfigItem<'data/quotes.json', QuoteInfoIndex>,
];

type RouterPathOf<T extends APIConfig> = {
  [K in keyof T]: T[K]['__routerPath__'];
};

export type APIData = {
  [P in APIConfig[number] as P['__apiPath__']]: P['__data__'];
} & {
  [P in StaticFileConfig[number] as P['__apiPath__']]: P['__data__'];
};

export const routePaths: RouterPathOf<APIConfig> = [
  '/finance/base-rates/:bank',
  '/finance/quote/:symbol',
  '/finance/quote-statistics/:symbol',
  '/finance/quote-etf-holdings/:symbol',
  '/finance/quote-history/:symbol',
  '/finance/quote-history-summary/:symbol',
  '/finance/equity-value-history/:symbol',
  '/finance/:benchmark',
  '/finance/:benchmark',
  '/finance/:benchmark',
  '/finance/:benchmark',
  '/finance/:benchmark',
  '/finance/:benchmark',
  '/finance/:benchmark',
  '/finance/fred/:series',
  '/my/position/:position',
  '/my/finance',
  '/my/body',
  '/my/journal',
  '/my/moneybook',
  '/my/summary',
  '/my/life-indicator',
  '/my/finance-indicator',
  '/my/skin-indicator',
  '/my/links',
  '/my/refs',
  '/my/rescuetime',
  '/my/rescuetime/:date',
  '/reverse-geocoding',
  '/weather',
];
