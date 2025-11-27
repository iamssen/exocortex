import type { Routes } from '../index.js';

async function api<P extends keyof Routes>(
  path: P,
  ...args: Routes[P]['query'] extends never ? [] : [query: Routes[P]['query']]
): Promise<Routes[P]['data']> {
  return {} as Routes[P]['data'];
}

await api('finance/base-rates/BCB');
await api('reverse-geocoding', {
  longitude: 0,
  latitude: 0,
});
// @ts-expect-error query 필수인 API에 query가 없으면 error 발생
await api('reverse-geocoding');
