// libs
import { useState } from "preact/hooks";

export const useRating = (token: string) => {
  const [rating, setRating] = useState(0);

  const updateRating = async (orderId, newRating) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/rate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ orderId, rating: newRating }),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating rating");
      }

      setRating(newRating);
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  return { rating, updateRating };
};
