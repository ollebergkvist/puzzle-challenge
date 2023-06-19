// libs
import { useEffect, useState } from "preact/hooks";

export const useQuantityUpdate = (orderItems) => {
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (orderItems && orderItems.length > 0) {
      const initialQuantities = orderItems.reduce((acc, item) => {
        return {
          ...acc,
          [item.id]: item.quantity,
        };
      }, {});
      setQuantities(initialQuantities);
    }
  }, [orderItems]);

  const updateQuantity = (itemId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: quantity,
    }));
  };

  return { quantities, updateQuantity };
};
