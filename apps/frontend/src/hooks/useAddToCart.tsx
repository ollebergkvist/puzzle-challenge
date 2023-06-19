// libs
import { useState, useEffect } from "preact/hooks";

// types
import type { JSX } from "preact/jsx-runtime";

export const useAddToCart = (token: string) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const addToCart = async () => {
      if (selectedProductId) {
        try {
          setIsLoading(true);
          setSuccess(false);

          const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
            method: "POST",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId: selectedProductId }),
          });

          if (response.ok) {
            setSelectedProductId(null);
            setSuccess(true);
            setIsLoading(false);
          } else {
            setIsLoading(false);
            throw new Error("Error adding item to cart");
          }
        } catch (error) {
          setIsLoading(false);
          console.error("Error adding item to cart:", error);
        }
      }
    };

    addToCart();
  }, [selectedProductId, token]);

  const handleOnClick = (
    event: JSX.TargetedEvent<HTMLButtonElement, Event>
  ) => {
    const productId = event.currentTarget.dataset.productId;

    setSelectedProductId(productId);
  };

  return { handleOnClick, success, isLoading };
};
