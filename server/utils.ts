import type { ReverseGeocoding, Weather } from '../model/index.js';
import type { API } from './types.js';

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
