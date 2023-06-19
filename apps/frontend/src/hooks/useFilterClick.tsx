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

      const selectedTitleNames = selectedTitles.join(",");
      const selectedCategoryNames = selectedCategories.join(",");

      if (selectedTitleNames || selectedCategoryNames) {
        const response = await fetch(
          `${apiUrl}/products/filter?itemName=${selectedTitleNames}&categoryName=${selectedCategoryNames}`
        );
        const filteredProducts = await response.json();

        setFilteredProducts(filteredProducts);
      } else {
        setFilteredProducts([]);
      }

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
