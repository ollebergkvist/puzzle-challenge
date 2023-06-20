export const currencyConverter = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
) => {
  const conversionRates = {
    USD: 1, // 1 USD = 1 USD
    EUR: 1.07, // 1 USD = 1.07 EUR
    L: 24, // 1 USD = 24 L
  };

  const usdAmount = amount / conversionRates[fromCurrency];

  const convertedAmount = usdAmount * conversionRates[toCurrency];

  return convertedAmount;
};
