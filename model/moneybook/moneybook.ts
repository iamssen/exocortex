import type { ASC, Iso8601 } from '../nominal-types.js';

export interface MoneybookHistory {
  date: Iso8601;
  category: string;
  description?: string;
  amount: number;
  event?: string;
}

export interface MoneybookEvent {
  name: string;
  total: number;
  children: ASC<MoneybookHistory>;
}

export interface AggregatedMoneybook {
  range: [Iso8601, Iso8601];
  total: number;
  categories: Record<string, number>;
  children: ASC<MoneybookHistory>;
}

export interface MonthlyMoneybook extends AggregatedMoneybook {
  /** yyyy-MM-01 */
  month: Iso8601;
}

export interface YearlyMoneybook extends AggregatedMoneybook {
  /** yyyy */
  year: number;
}

export interface Moneybook {
  expenses: ASC<MoneybookHistory>;
  incomes: ASC<MoneybookHistory>;

  monthlyExpenses: ASC<MonthlyMoneybook>;
  monthlyIncomes: ASC<MonthlyMoneybook>;

  yearlyExpenses: ASC<YearlyMoneybook>;
  yearlyIncomes: ASC<YearlyMoneybook>;

  events: ASC<MoneybookEvent>;
}
