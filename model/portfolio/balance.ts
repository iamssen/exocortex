export interface Balance<Currency extends number = number> {
  name: string;
  amount: Currency;
}

export interface Balances<Currency extends number = number> {
  totalAmount: Currency;
  list: Balance<Currency>[];
}
