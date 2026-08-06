import type { ASC, Iso8601, IsoWeek, Timestamp } from '../nominal-types.ts';

export interface DayKcal {
  date: Iso8601;
  timestamp: Timestamp;
  totalKcal: number;
  drinking: boolean;
  meals: Meal[];
}

export interface Meal {
  name: string;
  totalKcal: number;
  foods: Array<{ name: string; kcal: number }>;
}

export interface DayWeight {
  date: Iso8601;
  weight: number;
}

export interface DayWaist {
  date: Iso8601;
  waist: number;
}

export interface DayEnergy {
  date: Iso8601;
  energy: number;
}

export interface DayExercise {
  date: Iso8601;
  exercise: number;
}

export type SkinEvent =
  | `피부과(${string})`
  | `항생제(${string})`
  | `연고(${string})`
  | `후시딘`
  | `마데카솔`
  | `면도`
  | `욕조`;

export interface DaySkin {
  date: Iso8601;
  timestamp: Timestamp;
  severity: number;
  pustules: number;
  skincare: string[];
  haircare: string[];
  description: string;
  events: SkinEvent[];
}

type Week<T> = [T, T, T, T, T, T, T];

export interface AggregatedBody {
  range: [Iso8601, Iso8601];

  avgDayKcal?: number;
  avgDayWeight?: number;
  avgDayWaist?: number;
  avgDayEnergy?: number;
  totalExercise?: number;
  avgDaySkinSeverity?: number;
  avgDaySkinPustules?: number;

  dayKcals: (DayKcal | null)[];
  dayWeights: (DayWeight | null)[];
  dayWaists: (DayWaist | null)[];
  dayEnergies: (DayEnergy | null)[];
  dayExercises: (DayExercise | null)[];
  daySkins: (DaySkin | null)[];
}

export interface WeeklyBody extends AggregatedBody {
  week: IsoWeek;

  dayKcals: Week<DayKcal | null>;
  dayWeights: Week<DayWeight | null>;
  dayWaists: Week<DayWaist | null>;
  dayEnergies: Week<DayEnergy | null>;
  dayExercises: Week<DayExercise | null>;
  daySkins: Week<DaySkin | null>;
}

export interface MonthlyBody extends AggregatedBody {
  /** yyyy-MM-01 */
  month: Iso8601;

  dayKcals: ASC<DayKcal>;
  dayWeights: ASC<DayWeight>;
  dayWaists: ASC<DayWaist>;
  dayEnergies: ASC<DayEnergy>;
  dayExercises: ASC<DayExercise>;
  daySkins: ASC<DaySkin>;
}

export interface Body {
  dayKcals: ASC<DayKcal>;
  dayWeights: ASC<DayWeight>;
  dayWaists: ASC<DayWaist>;
  dayEnergies: ASC<DayEnergy>;
  dayExercises: ASC<DayExercise>;
  daySkins: ASC<DaySkin>;

  weeks: ASC<WeeklyBody>;
  months: ASC<MonthlyBody>;
}
