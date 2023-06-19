// libs
import { useEffect, useState } from "preact/hooks";

export const useGetOrders = (token: string) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
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

    fetchOrders();
  }, [token]);

  return { orders, isLoading, error };
};
