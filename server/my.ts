import type {
  Body,
  EventIndicator,
  ExpiryData,
  Journal,
  Link,
  Moneybook,
  Portfolio,
  PortfolioSummaries,
  Rescuetime,
  RescuetimeActivity,
  VersionData,
} from '../model/index.js';
import type { API } from './types.js';

export type MyAPI = [
  API<
    '매매 포지션 기록',
    '/position/:position',
    `position/${string}`,
    string // Markdown
  >,
  API<'Portfolio', '/portfolio', `portfolio`, VersionData<Portfolio>>,
  API<'Body', '/body', `body`, VersionData<Body>>,
  API<'Journal', '/journal', `journal`, VersionData<Journal>>,
  API<'Moneybook', '/moneybook', `moneybook`, VersionData<Moneybook>>,
  API<
    'Portfolio 날짜별 변동 기록',
    '/portfolio-history',
    `portfolio-history`,
    VersionData<PortfolioSummaries>
  >,
  API<
    'Life Indicator',
    '/life-indicator',
    `life-indicator`,
    VersionData<EventIndicator[]>
  >,
  API<
    'Finance Indicator',
    '/finance-indicator',
    `finance-indicator`,
    VersionData<EventIndicator[]>
  >,
  API<
    'Skin Indicator',
    '/skin-indicator',
    `skin-indicator`,
    VersionData<EventIndicator[]>
  >,
  API<'Links', '/links', `links`, VersionData<Link[]>>,
  API<'Refs', '/refs', `refs`, VersionData<Link[]>>,
  API<'Rescuetime', '/rescuetime', `rescuetime`, ExpiryData<Rescuetime>>,
  API<
    '특정일의 Rescuetime Activities',
    '/rescuetime/:date',
    `rescuetime/${string}`,
    RescuetimeActivity[]
  >,
];
