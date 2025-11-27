import type {
  Balances,
  Bonds,
  Deposits,
  FX,
  JoinedFX,
  Quote,
} from '../model/index.js';
import { fillPercentToGain } from './helpers/fillPercentToGain.js';

export function joinFxAndQuote<Currency extends number = number>(
  fx: FX<Currency>,
  balances: Balances<Currency>,
  deposits: Deposits<Currency> | undefined,
  bonds: Bonds<Currency> | undefined,
  quoteOrQuotes: Quote | Map<string, Quote> | undefined,
): JoinedFX<Currency> {
  const quote =
    quoteOrQuotes instanceof Map ? quoteOrQuotes.get(fx.symbol) : quoteOrQuotes;

  const totalAmount =
    balances.totalAmount +
    (deposits?.totalAmount ?? 0) +
    (bonds?.totalPurchasePrice ?? 0);

  if (!quote) {
    return {
      fx,
      quote,
      gain: fillPercentToGain({
        sharesGain: 0,
        realizedGain: fx.realizedGain,
        daysGain: 0,
        totalGain: fx.realizedGain,
        marketValue: totalAmount * fx.purchaseAmount,
      }),

      totalAmount: totalAmount as Currency,
      balances,
      deposits,
      bonds,
    };
  }

  const sharesGain =
    quote.price * totalAmount - fx.avgExchangeRate * totalAmount;
  const daysGain = totalAmount * quote.change;
  const marketValue = totalAmount * quote.price;

  return {
    fx,
    quote,
    gain: fillPercentToGain({
      sharesGain,
      realizedGain: fx.realizedGain,
      daysGain,
      totalGain: fx.realizedGain + sharesGain,
      marketValue,
    }),
    totalAmount: totalAmount as Currency,
    balances,
    deposits,
    bonds,
  };
}
