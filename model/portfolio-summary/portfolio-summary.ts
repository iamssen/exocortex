import type { Iso8601, JPY, KRW, Percent, USD } from '../nominal-types.ts';

/**
 * @deprecated 추후 좀 더 가벼운 구조로 Server 전용으로 변경 (History 용으로...)
 */
export interface PortfolioSummary {
  /** financeData.fx.usd.purchaseAmount */
  purchaseUSD: USD;
  purchaseUSDKRW: KRW;

  /** financeData.fx.jpy.purchaseAmount */
  purchaseJPY: JPY;
  purchaseJPYKRW: KRW;

  /**
   * financeData.balances.usd.totalAmount
   * + financeData.bonds.us.totalPurchasePrice
   * + us.gain.marketValue
   */
  currentUSD: USD;
  currentUSDKRW: KRW;

  /**
   * financeData.balances.jpy.totalAmount
   * + jp.gain.marketValue
   */
  currentJPY: JPY;
  currentJPYKRW: KRW;

  principal: KRW;
  totalGain: KRW;
  totalGainPercent: Percent;

  marketValue: KRW;

  // ---------------------------------------------
  // risklessValue + stocksValue + cryptoValue = marketValue
  // ---------------------------------------------
  risklessValue: KRW;
  stocksValue: KRW;
  cryptoValue: KRW;

  risklessPercent: Percent;
  stocksPercent: Percent;
  cryptoPercent: Percent;

  /**
   * For calculate "Living years without investment"
   *
   * financeData.balances.usd.totalAmount * usd
   * + financeData.balances.jpy.totalAmount * jpy
   * + financeData.bonds.kr.totalPurchasePrice
   * + financeData.bonds.us.totalPurchasePrice * usd
   * + stockValues :
   *      kr.gain.marketValue
   *      + us.gain.marketValue * usd
   *      + jp.gain.marketValue * jpy
   * + cryptoValue :
   *      (crypto.gain.marketValue - stableCoinMarketValue) * usd
   */
  investment: KRW;

  // ---------------------------------------------
  // distribution
  // ---------------------------------------------
  usd: {
    cash: USD;
    riskless: USD;
    stocks: USD;
    exchangeRate: KRW;
  };

  jpy: {
    cash: JPY;
    stocks: JPY;
    exchangeRate: KRW;
  };

  krw: {
    cash: KRW;
    housing: KRW;
    riskless: KRW;
    stocks: KRW;
    otherCurrencies: KRW;
  };

  crypto: {
    stable: USD;
    coins: USD;
    exchangeRate: KRW;
  };
}

export type PortfolioSummaries = Record<Iso8601, PortfolioSummary>;
