import type {
  JoinedHolding,
  JoinedHoldings,
  JPY,
  KRW,
  Percent,
  Portfolio,
  PortfolioSummary,
  Quote,
  USD,
} from '../model/index.js';

export function getStableCoinMarketValue(holdings: JoinedHolding[]): USD {
  return holdings
    .filter(
      ({ holding }) =>
        holding.symbol === 'USDT-USD' || holding.symbol === 'BUSD-USD',
    )
    .reduce((t, { holding }) => holding.shares + t, 0) as USD;
}

export function createSummary(
  financeData: Portfolio,
  usdkrw: Quote,
  jpykrw: Quote,
  us: JoinedHoldings,
  kr: JoinedHoldings,
  jp: JoinedHoldings,
  crypto: JoinedHoldings,
  otherCurrenciesTotalAmount: KRW,
): PortfolioSummary {
  const usd = usdkrw.price as KRW;
  const jpy = jpykrw.price as KRW;

  const stableCoinMarketValue: USD = getStableCoinMarketValue(crypto.holdings);

  const purchaseUSDKRW = (financeData.fx.usd.purchaseAmount *
    financeData.fx.usd.avgExchangeRate) as KRW;

  const purchaseJPYKRW = (financeData.fx.jpy.purchaseAmount *
    financeData.fx.jpy.avgExchangeRate) as KRW;

  const currentUSD = (financeData.balances.usd.totalAmount +
    financeData.bonds.us.totalPurchasePrice +
    us.gain.marketValue) as USD;

  const currentUSDKRW = (currentUSD * usd) as KRW;

  const currentJPY = (financeData.balances.jpy.totalAmount +
    jp.gain.marketValue) as JPY;

  const currentJPYKRW = (currentJPY * jpy) as KRW;

  // ---------------------------------------------
  // market value
  // ---------------------------------------------
  const risklessValue = (otherCurrenciesTotalAmount +
    financeData.balances.krw.totalAmount +
    financeData.housing.totalAmount +
    financeData.balances.usd.totalAmount * usd +
    financeData.balances.jpy.totalAmount * jpy +
    financeData.deposits.kr.totalAmount +
    financeData.bonds.kr.totalPurchasePrice +
    financeData.bonds.us.totalPurchasePrice * usd +
    stableCoinMarketValue * usd) as KRW;

  const stocksValue = (kr.gain.marketValue +
    us.gain.marketValue * usd +
    jp.gain.marketValue * jpy) as KRW;

  const cryptoValue = ((crypto.gain.marketValue - stableCoinMarketValue) *
    usd) as KRW;

  const marketValue = (risklessValue + stocksValue + cryptoValue) as KRW;

  const risklessPercent = ((risklessValue / marketValue) * 100) as Percent;
  const stocksPercent = ((stocksValue / marketValue) * 100) as Percent;
  const cryptoPercent = ((cryptoValue / marketValue) * 100) as Percent;

  // ---------------------------------------------
  // total gain
  // ---------------------------------------------
  const principal = (otherCurrenciesTotalAmount +
    financeData.balances.krw.totalAmount +
    financeData.housing.totalAmount +
    financeData.deposits.kr.totalAmount +
    financeData.bonds.kr.totalPurchasePrice +
    (kr.gain.marketValue - kr.gain.totalGain) +
    purchaseUSDKRW +
    financeData.fx.usd.realizedGain +
    purchaseJPYKRW +
    financeData.fx.jpy.realizedGain +
    (crypto.gain.marketValue - crypto.gain.totalGain) *
      financeData.fx.usd.avgExchangeRate) as KRW;

  const totalGain = (marketValue - principal) as KRW;
  const totalGainPercent = ((totalGain / principal) * 100) as Percent;

  const investment = (financeData.balances.usd.totalAmount * usd +
    financeData.balances.jpy.totalAmount * jpy +
    financeData.bonds.kr.totalPurchasePrice +
    financeData.bonds.us.totalPurchasePrice * usd +
    stocksValue +
    cryptoValue) as KRW;

  const purchaseUSD = financeData.fx.usd.purchaseAmount;
  const purchaseJPY = financeData.fx.jpy.purchaseAmount;

  return {
    purchaseUSD,
    purchaseUSDKRW,
    purchaseJPY,
    purchaseJPYKRW,
    currentUSD,
    currentUSDKRW,
    currentJPY,
    currentJPYKRW,
    principal,
    marketValue,
    totalGain,
    totalGainPercent,
    risklessValue,
    stocksValue,
    cryptoValue,
    risklessPercent,
    stocksPercent,
    cryptoPercent,
    investment,
    usd: {
      cash: financeData.balances.usd.totalAmount,
      riskless: financeData.bonds.us.totalPurchasePrice,
      stocks: us.gain.marketValue as USD,
      exchangeRate: usd,
    },
    jpy: {
      cash: financeData.balances.jpy.totalAmount,
      stocks: jp.gain.marketValue as JPY,
      exchangeRate: jpy,
    },
    krw: {
      cash: financeData.balances.krw.totalAmount,
      housing: financeData.housing.totalAmount,
      riskless: (financeData.deposits.kr.totalAmount +
        financeData.bonds.kr.totalPurchasePrice) as KRW,
      stocks: kr.gain.marketValue as KRW,
      otherCurrencies: otherCurrenciesTotalAmount,
    },
    crypto: {
      stable: stableCoinMarketValue,
      coins: (crypto.gain.marketValue - stableCoinMarketValue) as USD,
      exchangeRate: usd,
    },
  };
}
