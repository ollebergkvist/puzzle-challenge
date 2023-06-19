// context
import { useAuthContext } from "../../context";

// hooks
import { useCheckout, useGetCart } from "../../hooks";

// components
import { LoadingSpinner } from "../../components";

// utils
import { calculateTotalPrice, priceFormatter } from "../../utils";

export const Cart = () => {
  const { token } = useAuthContext();
  const { cartItems, isCartLoading, error } = useGetCart(token);

  const {
    isLoading: isCheckingOut,
    error: checkoutError,
    checkout,
  } = useCheckout(token);

  if (isCartLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const totalPrice = calculateTotalPrice(cartItems);

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center space-x-4">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-16 h-16 object-contain"
                />

                <div>
                  <p className="font-bold">{item.product.title}</p>
                  <p>${priceFormatter(item.product.price)}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-4">Total Price: ${priceFormatter(totalPrice)}</p>

          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={checkout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? "Checking out..." : "Checkout"}
          </button>

          {checkoutError && (
            <div>Error during checkout: {checkoutError.message}</div>
          )}
        </>
      )}
    </div>
  );
};
