// libs
import { useState } from "preact/hooks";

export const useSortByPrice = () => {
  const [sortByPriceOrder, setSortByPriceOrder] = useState(null);

  const handleSortByPrice = () => {
    if (sortByPriceOrder === null) {
      setSortByPriceOrder("asc");
    }
    if (sortByPriceOrder === "asc") {
      setSortByPriceOrder("desc");
    } else {
      setSortByPriceOrder("asc");
    }
  };

  return { sortByPriceOrder, handleSortByPrice };
};
