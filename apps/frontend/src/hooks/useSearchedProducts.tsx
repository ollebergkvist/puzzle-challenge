// libs
import { useState, useEffect } from "preact/hooks";

export const useSearchedProducts = (
  initialTitleValues: string[],
  initialCategoryValues: string[]
) => {
  const [loading, setLoading] = useState(false);
  const [queriedProducts, setQueriedProducts] = useState([]);
  const [titleValues, setTitleValues] = useState(initialTitleValues);
  const [categoryValues, setCategoryValues] = useState(initialCategoryValues);

  const fetchFilteredProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/products/filter?itemName=${titleValues.join(
          ","
        )}&categoryName=${categoryValues.join(",")}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch filtered products");
      }

      const filteredProducts = await response.json();
      setQueriedProducts(filteredProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error retrieving filtered products:", error);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [titleValues, categoryValues]);

  const handleTitleFilterChange = (selectedValues: string[]) => {
    setTitleValues(selectedValues);
  };

  const handleCategoryFilterChange = (selectedValues: string[]) => {
    setCategoryValues(selectedValues);
  };

  return {
    loading,
    queriedProducts,
    handleTitleFilterChange,
    handleCategoryFilterChange,
  };
};
