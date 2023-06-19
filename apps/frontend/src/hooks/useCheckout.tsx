// libs
import { route } from "preact-router";
import { useState } from "preact/hooks";

// context
import { useViewToggleContext } from "../context";

export const useCheckout = (token: string) => {
  const { setActiveView } = useViewToggleContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/create`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error creating order");
      }

      setIsLoading(false);

      setActiveView("My Orders");

      route("/");
    } catch (error) {
      console.error("Error during checkout:", error);

      setError(error);
      setIsLoading(false);
    }
  };

  return { isLoading, error, checkout };
};
