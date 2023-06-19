export const getCartUrl = `${import.meta.env.VITE_API_URL}/cart/items`;
export const createPaymentUrl = `${import.meta.env.VITE_API_URL}/orders/pay`;
export const cancelOrderUrl = `${import.meta.env.VITE_API_URL}/orders/cancel`;

export const createDynamicUrl = (orderId) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const orderUrl = `${baseUrl}/orders/${orderId}`;

  return {
    getOrderUrl: orderUrl,
    updateOrderUrl: orderUrl,
    deleteOrderItemUrl: orderUrl,
  };
};
