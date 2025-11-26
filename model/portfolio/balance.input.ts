type BalanceSource = { name: string; amount: string | number };

export type BalanceInput = {
  [symbol: string]: Array<BalanceSource>;
};
