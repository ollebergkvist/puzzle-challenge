// libs
import { useEffect, useState } from "preact/hooks";

// utils
import { getProductsUrl } from "../utils";

export const useFetchData = (titles: any, categories: any, search: string) => {
  const [products, setProducts] = useState([]);
  const [unfilteredProducts, setUnfilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // if (titles || categories || search) {
      //   url += "?";
      //   if (titles) url += `titles=${titles}&`;
      //   if (categories) url += `categories=${categories}&`;
      //   if (search) url += `search=${search}`;
      // }

      const requestBody = {
        itemNames: titles || [],
        categoryNames: categories || [],
        search: search || [],
      };
      console.log(
        "🚀 ~ file: useFetchData.tsx:29 ~ fetchData ~ requestBody:",
        requestBody
      );

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
      console.log("🚀 ~ file: useFetchData.tsx:48 ~ fetchData ~ data:", data);

      if (!titles.length && !categories.length && !search) {
        console.log("1");
        setUnfilteredProducts(data);
        setProducts(data);
        setLoading(false);
      } else {
        console.log("2");
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
  }, [titles, categories, search]);

  useEffect(() => {
    fetchData();
  }, []);

  return { products, unfilteredProducts, loading, error };
};
