// libs
import { useEffect, useState } from "preact/hooks";

// utils
import { getProductsUrl } from "../utils";

export const useFetchData = (titles: any, categories: any) => {
  const [products, setProducts] = useState([]);
  const [unfilteredProducts, setUnfilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        itemNames: titles || [],
        categoryNames: categories || [],
      };

      const response = await fetch(getProductsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Error fetching products");
      }

      const data = await response.json();

      if (!titles.length && !categories.length) {
        setUnfilteredProducts(data);
        setProducts(data);
        setLoading(false);
      } else {
        setProducts(data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);

      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [titles, categories]);

  useEffect(() => {
    fetchData();
  }, []);

  return { products, unfilteredProducts, loading, error };
};
