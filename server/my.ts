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
    '/my/position/:position',
    `my/position/${string}`,
    string // Markdown
  >,
  API<'Portfolio', '/my/portfolio', `my/portfolio`, VersionData<Portfolio>>,
  API<'Body', '/my/body', `my/body`, VersionData<Body>>,
  API<'Journal', '/my/journal', `my/journal`, VersionData<Journal>>,
  API<'Moneybook', '/my/moneybook', `my/moneybook`, VersionData<Moneybook>>,
  API<
    'Finance Summary',
    '/my/summary',
    `my/summary`,
    VersionData<PortfolioSummaries>
  >,
  API<
    'Life Indicator',
    '/my/life-indicator',
    `my/life-indicator`,
    VersionData<EventIndicator[]>
  >,
  API<
    'Finance Indicator',
    '/my/finance-indicator',
    `my/finance-indicator`,
    VersionData<EventIndicator[]>
  >,
  API<
    'Skin Indicator',
    '/my/skin-indicator',
    `my/skin-indicator`,
    VersionData<EventIndicator[]>
  >,
  API<'Links', '/my/links', `my/links`, VersionData<Link[]>>,
  API<'Refs', '/my/refs', `my/refs`, VersionData<Link[]>>,
  API<'Rescuetime', '/my/rescuetime', `my/rescuetime`, ExpiryData<Rescuetime>>,
  API<
    '특정일의 Rescuetime Activities',
    '/my/rescuetime/:date',
    `my/rescuetime/${string}`,
    RescuetimeActivity[]
  >,
];
