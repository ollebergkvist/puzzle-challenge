// libs
import { useState, useEffect } from "preact/hooks";

export const useFilterClick = (
  selectedTitles: string[],
  selectedCategories: string[],
  apiUrl: string
) => {
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const handleFilterClick = async () => {
    try {
      setIsFiltering(true);

      const requestBody = {
        itemNames: selectedTitles.map((title) => title),
        categoryNames: selectedCategories.map((category) => category),
      };

      const response = await fetch(`${apiUrl}/products/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const filteredProducts = await response.json();
      setFilteredProducts(filteredProducts);

      setIsFiltering(false);
    } catch (error) {
      console.error("Error filtering products:", error);
      setIsFiltering(false);
    }
  };

  useEffect(() => {
    handleFilterClick();
  }, [selectedTitles, selectedCategories]);

  return { filteredProducts, isFiltering };
};
