// context
import { useAuthContext } from "../../context";

// hooks
import {
  useSortByPrice,
  useGetOrders,
  useDynamicAPI,
  useRating,
  useFilter,
} from "../../hooks";

// utils
import {
  cancelOrderUrl,
  createPaymentUrl,
  formatDate,
  priceFormatter,
  rating,
  status,
} from "../../utils";

// components
import { Filter, LoadingSpinner, Rating, Notification } from "..";

// types
import type { JSX } from "preact/jsx-runtime";
import { useEffect } from "preact/hooks";

export const Orders = (): JSX.Element => {
  const { token } = useAuthContext();

  const { sortByPriceOrder, handleSortByPrice } = useSortByPrice();
  const { updateRating } = useRating(token);

  const {
    selectedValues: selectedStatus,
    handleFilterChange: handleStatusFilterChange,
  } = useFilter();

  const {
    selectedValues: selectedRatings,
    handleFilterChange: handleRatingsFilterChange,
  } = useFilter();

  const {
    orders,
    isLoading: isLoadingOrders,
    error: getOrdersError,
    fetchOrders: refetchOrders,
  } = useGetOrders(token, selectedStatus, selectedRatings, sortByPriceOrder);

  const {
    isLoading: isPaymentLoading,
    error: paymentError,
    fetchData: payOrder,
    success: paymentSuccess,
  } = useDynamicAPI(token, createPaymentUrl, "PUT");

  const {
    isLoading: isCancellingOrder,
    error: cancelOrderError,
    fetchData: cancelOrder,
    success: cancelSuccess,
  } = useDynamicAPI(token, cancelOrderUrl, "PUT");

  useEffect(() => {
    if (paymentSuccess || cancelSuccess) {
      refetchOrders();
    }
  }, [paymentSuccess, cancelSuccess]);

  const handleEditOrder = (event) => {
    const orderId = event.target.id;

    // editOrder(orderId)
  };

  return (
    <div className="min-h-screen">
      {paymentSuccess && <Notification message="Order succesully paid!" />}

      {cancelSuccess && <Notification message="Order succesfully cancelled!" />}

      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="flex space-x-3 mt-4">
        {selectedStatus && (
          <Filter
            buttonTitle="Filter by status"
            filterTitle="Title"
            values={status}
            selectedValues={selectedStatus}
            handleFilterChange={handleStatusFilterChange}
          />
        )}

        {selectedRatings && (
          <Filter
            buttonTitle="Filter by rating"
            filterTitle="Category"
            selectedValues={selectedRatings}
            values={rating}
            handleFilterChange={handleRatingsFilterChange}
          />
        )}

        <button
          className={`text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
          type="button"
          onClick={handleSortByPrice}
        >
          Sort by price{" "}
          {sortByPriceOrder
            ? `(${sortByPriceOrder === "asc" ? "ASC" : "DESC"})`
            : "DESC"}
        </button>
      </div>

      {isLoadingOrders ? (
        <LoadingSpinner />
      ) : (
        <div>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="flex flex-col space-y-12 mt-10">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border-b mb-4 py-4 px-4 rounded-lg shadow-sm bg-white"
                >
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
                          onClick={(event) =>
                            cancelOrder({ orderId: event.target.id })
                          }
                          disabled={isCancellingOrder}
                        >
                          {isCancellingOrder ? "Cancelling..." : "Cancel"}
                        </button>

                        <button
                          id={order.id}
                          className="px-4 py-2 bg-green-500 text-white rounded ml-2"
                          onClick={(event) =>
                            payOrder({ orderId: event.target.id })
                          }
                          disabled={isPaymentLoading}
                        >
                          {isPaymentLoading ? "Paying..." : "Pay"}
                        </button>
                      </div>
                    )}

                    {paymentError && (
                      <div className="mt-2 text-red-500">
                        {paymentError.message}
                      </div>
                    )}

                    {cancelOrderError && (
                      <div className="mt-2 text-red-500">
                        {cancelOrderError.message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {getOrdersError && <div>Error: {getOrdersError.message}</div>}
        </div>
      )}
    </div>
  );
};
