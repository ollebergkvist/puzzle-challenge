import { useState } from "preact/hooks";

export const useCancelOrder = (token) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelOrder = async (orderId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ orderId }),
        }
      );

      if (!response.ok) {
        throw new Error("Error canceling order");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error canceling order:", error);
      setError(error);
      setIsLoading(false);
    }
  };

  return { cancelOrder, isLoading, error };
};
