// context
import { useAuthContext } from "../../context";

// hooks
import { useGetOrders, usePayOrder, useRating } from "../../hooks";

// utils
import { formatDate, priceFormatter } from "../../utils";

// components
import { LoadingSpinner, Rating } from "..";

// types
import type { JSX } from "preact/jsx-runtime";

export const Orders = (): JSX.Element => {
  const { token } = useAuthContext();

  const { orders, isLoading, error } = useGetOrders(token);

  const {
    isLoading: isPaymentLoading,
    error: isPaymentError,
    payOrder,
  } = usePayOrder(token);

  const { updateRating } = useRating(token);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleEditOrder = (event) => {
    const orderId = event.target.id;
  };

  const handleCancelOrder = (event) => {
    const orderId = event.target.id;
  };

  const handlePayOrder = (event) => {
    const orderId = event.target.id;

    payOrder(orderId);
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id} className="border-b mb-4 pb-4">
              <div className="w-full">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="flex flex-col space-y-4 order-2 sm:order-1">
                    <p className="font-semibold text-sm sm:text-base">
                      Order ID: {order.id}
                    </p>

                    {order.status === "COMPLETED" && (
                      <Rating
                        orderId={order.id}
                        initialRating={order.rating}
                        updateRating={updateRating}
                      />
                    )}
                  </div>

                  <p className="font-semibold mt-4 text-sm sm:text-base sm:mt-0 order-1 sm:order-2">
                    Order Date: {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="">
                <div className=" mt-8 ">
                  <table className="w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5  pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Product
                        </th>

                        <th
                          scope="col"
                          className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 lg:table-cell"
                        >
                          Price
                        </th>

                        <th
                          scope="col"
                          className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                        >
                          Interest
                        </th>

                        <th
                          scope="col"
                          className="pl-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                            {item.product.title}
                          </td>

                          <td className="px-3 py-4 text-sm text-right text-gray-500 lg:table-cell">
                            {priceFormatter(item.product.price)}
                          </td>

                          <td className="px-3 py-4 text-sm text-right  text-gray-500 sm:table-cell">
                            {priceFormatter(item.product.price * 0.15)}
                          </td>

                          <td className="px-3 py-4 text-sm  text-right  text-gray-500">
                            ${priceFormatter(item.product.price * 1.15)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 font-semibold text-right">
                  Total order: ${priceFormatter(order.totalPrice)}
                </p>

                {order.status === "ACTIVE" && (
                  <div className="flex mt-4 justify-end">
                    <button
                      id={order.id}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={handleEditOrder}
                    >
                      Edit
                    </button>

                    <button
                      id={order.id}
                      className="px-4 py-2 bg-red-500 text-white rounded ml-2"
                      onClick={handleCancelOrder}
                    >
                      Cancel
                    </button>

                    <button
                      id={order.id}
                      className="px-4 py-2 bg-green-500 text-white rounded ml-2"
                      onClick={handlePayOrder}
                      disabled={isPaymentLoading ? true : false}
                    >
                      {isPaymentLoading ? "Paying..." : "Pay"}
                    </button>
                  </div>
                )}

                {isPaymentError && (
                  <div className="mt-2 text-red-500">
                    {isPaymentError.message}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
