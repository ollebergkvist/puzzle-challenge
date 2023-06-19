export const calculateTotalPrice = (cartItems) =>
  cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
