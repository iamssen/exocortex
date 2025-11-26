export type NominalType<T extends string> = { __type: T };

export type Iso8601 = string & NominalType<'iso8601'>;
export type IsoWeek = string & NominalType<'isoweek'>;
export type IsoQuarter = string & NominalType<'isoquarter'>;
export type Timestamp = number & NominalType<'timestamp'>;
export type Timezone = string & NominalType<'timezone'>;

export type Ratio<T = number> = T & NominalType<'ratio'>;
export type Percent<T = number> = T & NominalType<'percent'>;

export type USD<T = number> = T & NominalType<'usd'>;
export type KRW<T = number> = T & NominalType<'krw'>;
export type JPY<T = number> = T & NominalType<'jpy'>;

export type ASC<T> = T[] & NominalType<'asc'>;
export type DESC<T> = T[] & NominalType<'desc'>;
