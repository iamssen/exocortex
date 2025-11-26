export const centralBankIds = {
  /** Korea */
  BOK: 96,
  /** USA */
  FED: 5,
  /** EU */
  ECB: 1,
  /** UK */
  BOE: 7,
  /** Switzerland */
  SNB: 6,
  /** Canada */
  BOC: 3,
  /** Japan */
  BOJ: 2,
  /** Russia */
  CBR: 131,
  /** India */
  RBI: 88,
  /** China */
  PBOC: 147,
  /** Brazil */
  BCB: 31,
} as const;

export type CentralBank = keyof typeof centralBankIds;
