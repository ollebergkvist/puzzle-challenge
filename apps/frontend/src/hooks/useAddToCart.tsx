// libs
import { useState, useEffect } from "preact/hooks";

// types
import type { JSX } from "preact/jsx-runtime";

export const useAddToCart = (token: string) => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const addToCart = async () => {
      if (selectedProductId) {
        try {
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
          } else {
            throw new Error("Error adding item to cart");
          }
        } catch (error) {
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

  return { handleOnClick };
};
