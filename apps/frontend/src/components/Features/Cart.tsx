// libs
import { useEffect } from "preact/hooks";

// context
import { useAuthContext } from "../../context";

// hooks
import { useCheckout, useDynamicAPI } from "../../hooks";

// components
import { LoadingSpinner } from "..";

// utils
import { calculateTotalPrice, getCartUrl, priceFormatter } from "../../utils";

export const Cart = () => {
  const { token } = useAuthContext();

  const {
    items: cartItems,
    isLoading: isCartLoading,
    error: cartError,
    fetchData: fetchCartItems,
  } = useDynamicAPI(token, getCartUrl);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const {
    isLoading: isCheckingOut,
    error: checkoutError,
    checkout,
  } = useCheckout(token);

  const totalPrice = calculateTotalPrice(cartItems);

  return (
    <div className="min-h-screen">
      {isCartLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <div className="h-screen">
                <h1 className="mb-10 text-2xl text-center font-bold sm:text-start">
                  Cart Items
                </h1>

                <div className="mx-auto justify-center pb-12 px-6 md:flex md:space-x-6 xl:px-0">
                  <div className="md:w-2/3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="rounded-lg overflow-hidden">
                        <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-full rounded-lg sm:w-40"
                          />

                          <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                            <div className="mt-5 sm:mt-0">
                              <h2 className="text-sm font-bold text-gray-900">
                                {item.product.title}
                              </h2>
                            </div>

                            <div>
                              <p>Quantity: {item.quantity}</p>
                            </div>

                            <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                              <div className="flex items-center space-x-4">
                                <p className="text-sm">
                                  ${priceFormatter(item.product.price)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
                    <div className="flex justify-between">
                      <p className="text-lg font-bold">Total</p>

                      <div className="">
                        <p className="mb-1 text-lg font-bold">
                          ${priceFormatter(totalPrice)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={checkout}
                      disabled={isCheckingOut}
                      className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
                    >
                      {isCheckingOut ? "Checking out..." : "Checkout"}
                    </button>

                    {cartError && (
                      <div>Error during checkout: {cartError.message}</div>
                    )}

                    {checkoutError && (
                      <div>Error during checkout: {checkoutError.message}</div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
