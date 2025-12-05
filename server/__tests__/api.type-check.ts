import type { APIConfig } from '../index.js';

type Routes = {
  [P in APIConfig[number] as P['__apiPath__']]: {
    description: P['__description__'];
    data: P['__data__'];
    query: P['__query__'];
  };
};

interface Options<Path> {
  path: Path;
}

async function api<P extends keyof Routes>(
  _path: P,
  ..._args: Routes[P]['query'] extends never
    ? [query?: {}, options?: Options<P>]
    : {} extends Routes[P]['query']
      ? [query?: Routes[P]['query'], options?: Options<P>]
      : [query: Routes[P]['query'], options?: Options<P>]
): Promise<Routes[P]['data']> {
  return {} as Routes[P]['data'];
}

await api('finance/base-rates/BCB');
await api('finance/base-rates/BCB', {});
await api('finance/base-rates/BCB', {}, { path: 'finance/base-rates/BCB' });
await api('reverse-geocoding', { longitude: 0, latitude: 0 });
await api(
  'reverse-geocoding',
  { longitude: 0, latitude: 0 },
  { path: 'reverse-geocoding' },
);
// @ts-expect-error query 필수인 API에 query가 없으면 error 발생
await api('reverse-geocoding');

await api('finance/quote-history/SPY');
await api('finance/quote-history/SPY', {});
await api(
  'finance/quote-history/SPY',
  {},
  { path: 'finance/quote-history/SPY' },
);
// @ts-expect-error cacheOnly는 boolean이어야 함
await api('finance/quote-history/SPY', { cacheOnly: 'a' });
