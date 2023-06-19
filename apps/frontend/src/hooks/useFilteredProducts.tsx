// libs
import { useState, useEffect } from "preact/hooks";

export const useFilteredProducts = (
  titleValues: string[],
  categoryValues: string[]
) => {
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
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
        setFilteredProducts(filteredProducts);
      } catch (error) {
        console.error("Error retrieving filtered products:", error);
        // Handle error
      }
    };

    fetchFilteredProducts();
  }, [titleValues, categoryValues]);

  return { data: filteredProducts };
};
