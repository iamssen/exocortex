import type { ReverseGeocoding, Weather } from '../model/index.ts';
import type { API } from './types.ts';

export type UtilsAPI = [
  API<
    'Location 정보 → 사람이 읽을 수 있는 주소',
    '/reverse-geocoding',
    `reverse-geocoding`,
    ReverseGeocoding,
    {
      longitude: number;
      latitude: number;
    }
  >,
  API<
    '특정 위치의 현재 날씨',
    '/weather',
    `weather`,
    Weather,
    {
      longitude: number;
      latitude: number;
    }
  >,
];
