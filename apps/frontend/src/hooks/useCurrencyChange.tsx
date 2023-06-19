// libs
import { useState } from "preact/hooks";

export const useCurrencyChange = () => {
  const [currency, setCurrency] = useState("USD");

  return { currency, setCurrency };
};
