// libs
import { useState, useEffect } from "preact/hooks";

export const useGetCart = (token: string) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/cart/items`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();

        setCartItems(data);
        setIsCartLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);

        setError(error);
        setIsCartLoading(false);
      }
    };

    fetchCartItems();
  }, [token]);

  return { cartItems, isCartLoading, error };
};
