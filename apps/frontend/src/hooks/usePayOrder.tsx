// libs
import { useState } from "preact/hooks";

export const usePayOrder = (token: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const payOrder = async (orderId) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/pay`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        }
      );

      if (!response.ok) {
        throw new Error("Order payment failed");
      }

      // Update the order status locally or fetch the updated orders again

      // Display an alert or snackbar to the user

      setIsLoading(false);
    } catch (error) {
      console.error("Error processing order payment:", error);

      setError(error.message);
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    payOrder,
  };
};
