import fs from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import type { ASC, Iso8601, QuoteRecord } from '../../model/index.js';
import { pickQuoteHistoryRecords } from '../pickQuoteHistoryRecords.js';

describe('pickHistoryItems()', () => {
  test('should pick matched items', async () => {
    const findingDates: Parameters<typeof pickQuoteHistoryRecords>[1] = [
      '2022-01-01' as Iso8601,
      { week: 1 },
      { month: 1 },
      { year: 1 },
      { year: 3 },
      { year: 5 },
    ];
    const baseDate = '2024-05-20' as Iso8601;

    const krw = await fs
      .readFile(
        path.resolve(import.meta.dirname, '__fixtures__/KRW=X.json'),
        'utf8',
      )
      .then((text) => JSON.parse(text))
      .then(({ data }) => data.records as ASC<QuoteRecord>);

    const expected = await fs
      .readFile(
        path.resolve(
          import.meta.dirname,
          '__fixtures__/pickQuoteHistoryRecords.expected.json',
        ),
        'utf8',
      )
      .then((text) => JSON.parse(text));

    const result = pickQuoteHistoryRecords(krw, findingDates, baseDate);

    expect(structuredClone(result)).toEqual(expected);
  });
});
