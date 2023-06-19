// libs
import { useEffect, useState } from "preact/hooks";

export const useGetOrders = (
  token: string,
  status?: any,
  rating?: any,
  sortBy?: string | null
) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let url = `${import.meta.env.VITE_API_URL}/orders`;

      // Add query parameters for filtering and sorting
      if (status || rating || sortBy) {
        url += "?";
        if (status) url += `status=${status}&`;
        if (rating) url += `rating=${rating}&`;
        if (sortBy) url += `sortBy=${sortBy}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching orders");
      }

      const data = await response.json();

      setOrders(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);

      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, status, rating, sortBy]);

  return { orders, isLoading, error, fetchOrders };
};
