// libs
import { useState } from "preact/hooks";

export const useSortByPrice = () => {
  const [sortByPriceOrder, setSortByPriceOrder] = useState(null);

  const handleSortByPrice = () => {
    if (sortByPriceOrder === null || sortByPriceOrder === "asc") {
      setSortByPriceOrder("desc");
    } else {
      setSortByPriceOrder("asc");
    }
  };

  return { sortByPriceOrder, handleSortByPrice };
};
