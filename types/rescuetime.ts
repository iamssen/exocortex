import type { ASC, Iso8601, IsoWeek } from './nominal-types.js';

export interface RescuetimeHistoryTimes {
  /** seconds */
  total: number;
  allProductive: number;
  allDistracting: number;
  veryProductive: number;
  productive: number;
  neutral: number;
  distracting: number;
  veryDistracting: number;
  business: number;
  communicationAndScheduling: number;
  socialNetworking: number;
  designAndComposition: number;
  entertainment: number;
  news: number;
  softwareDevelopment: number;
  referenceAndLearning: number;
  shopping: number;
  utilities: number;
}

type Week<T> = [T, T, T, T, T, T, T];

export interface RescuetimeHistory extends RescuetimeHistoryTimes {
  date: Iso8601;
}

export interface AggregatedRescuetimeHistory extends RescuetimeHistoryTimes {
  range: [Iso8601, Iso8601];

  children: (RescuetimeHistory | null)[];
}

export interface WeeklyRescuetimeHistory extends AggregatedRescuetimeHistory {
  week: IsoWeek;

  children: Week<RescuetimeHistory | null>;
}

export interface MonthlyRescuetimeHistory extends AggregatedRescuetimeHistory {
  /** yyyy-MM-01 */
  month: Iso8601;

  children: ASC<RescuetimeHistory>;
}

export interface Rescuetime {
  histories: ASC<RescuetimeHistory>;

  weekly: ASC<WeeklyRescuetimeHistory>;
  monthly: ASC<MonthlyRescuetimeHistory>;
}

export interface RescuetimeActivity {
  activity: string;
  /** seconds */
  time: number;
}
