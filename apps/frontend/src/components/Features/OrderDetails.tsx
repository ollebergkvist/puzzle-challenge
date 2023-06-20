// libs
import { route } from "preact-router";
import { useEffect } from "preact/hooks";

// context
import { useAuthContext, useViewToggleContext } from "../../context";

// hooks
import {
  useCurrencyChange,
  useDynamicAPI,
  useQuantityUpdate,
} from "../../hooks";

// utils
import {
  createDynamicUrl,
  currencyConverter,
  formatDate,
  priceFormatter,
} from "../../utils";

// components
import { LoadingSpinner } from "..";

// icons
import { TrashIcon } from "@heroicons/react/24/outline";

// types
import type { JSX } from "preact/jsx-runtime";
import { OrderDetailsPageProps } from "../../types";

export const OrderDetails = ({
  orderId,
}: OrderDetailsPageProps): JSX.Element => {
  const { token } = useAuthContext();
  const { setActiveView } = useViewToggleContext();

  const { getOrderUrl, updateOrderUrl, deleteOrderItemUrl } =
    createDynamicUrl(orderId);

  const {
    isLoading,
    items: order,
    fetchData,
  } = useDynamicAPI(token, getOrderUrl);

  const {
    isLoading: isUpdating,
    fetchData: updateOrder,
    success: updateOrderSuccess,
    error: updateOrderError,
  } = useDynamicAPI(token, updateOrderUrl, "PUT");

  const {
    isLoading: isDeleting,
    fetchData: deleteOrderItem,
    success: deleteOrderItemSuccess,
    error: deleteOrderItemError,
  } = useDynamicAPI(token, deleteOrderItemUrl, "DELETE");

  const { currency, setCurrency } = useCurrencyChange();
  const { quantities, updateQuantity } = useQuantityUpdate(order?.items);

  const handleUpdateOrder = async () => {
    const requestData = {
      itemsToAdd: [],
      currency: currency,
    };

    order.items.forEach((item) => {
      const newQuantity = quantities[item.id] || item.quantity;

      const parsedQuantity = parseInt(newQuantity);

      if (parsedQuantity !== item.quantity) {
        requestData.itemsToAdd.push({
          orderItemId: item.id,
          quantity: parsedQuantity,
        });
      }
    });

    await updateOrder(requestData);
  };

  useEffect(() => {
    fetchData();
  }, [updateOrderSuccess, deleteOrderItemSuccess]);

  return (
    <div className="h-screen">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="min-h-screen">
          {order && !order.deleted ? (
            <div>
              <div className="flex flex-col space-y-12 mt-10">
                <div className="border-b mb-4 py-4 px-4 rounded-lg shadow-sm bg-white">
                  <div className="w-full">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="flex flex-col space-y-4 order-2 sm:order-1">
                        {order.id && (
                          <p className="font-semibold text-sm sm:text-base">
                            Order ID: {order.id}
                          </p>
                        )}

                        {order.createdAt && (
                          <p className="font-semibold mt-4 text-sm sm:text-base sm:mt-0 order-1 sm:order-2">
                            Order Date: {formatDate(order.createdAt)}
                          </p>
                        )}

                        {order.currency && (
                          <p className="font-semibold mt-4 text-sm sm:text-base sm:mt-0 order-1 sm:order-2">
                            Order Currency: {order.currency}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {currency && (
                    <div className="mt-8">
                      <label
                        htmlFor="currencyInput"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Change Currency:
                        <select
                          id="currencyInput"
                          value={currency}
                          onChange={(event) => {
                            event.preventDefault();
                            setCurrency(event.target.value);
                          }}
                          className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="HNL">HNL</option>
                        </select>
                      </label>
                    </div>
                  )}

                  <div className="">
                    <div className="mt-8 ">
                      <table className="w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                            >
                              Product
                            </th>

                            <th
                              scope="col"
                              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 lg:table-cell"
                            >
                              Quantity
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

                            <th
                              scope="col"
                              className="pl-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                            >
                              Delete
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                          {order.items &&
                            order.items.map((item) => {
                              const price =
                                order.currency === "USD"
                                  ? item.product.price
                                  : currencyConverter(
                                      item.product.price,
                                      "USD",
                                      order.currency
                                    );

                              const total =
                                order.currency === "USD"
                                  ? item.quantity * item.product.price * 1.15
                                  : currencyConverter(
                                      item.quantity * item.product.price * 1.15,
                                      "USD",
                                      order.currency
                                    );

                              return (
                                <tr key={item.id}>
                                  {item.product.title && (
                                    <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                                      {item.product.title}
                                    </td>
                                  )}

                                  {item.product.price && (
                                    <>
                                      {quantities && (
                                        <td className="px-3 py-4 text-sm text-right flex justify-end text-gray-500">
                                          <input
                                            className="block w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            type="number"
                                            min="1"
                                            value={quantities[item.id] || ""}
                                            onChange={(event) => {
                                              event.preventDefault();
                                              updateQuantity(
                                                item.id,
                                                event.target.value
                                              );
                                            }}
                                          />
                                        </td>
                                      )}

                                      <td className="px-3 py-4 text-sm text-right text-gray-500 lg:table-cell">
                                        {priceFormatter(price)}
                                      </td>

                                      <td className="px-3 py-4 text-sm text-right text-gray-500 lg:table-cell">
                                        {priceFormatter(
                                          item.product.price * 0.15
                                        )}
                                      </td>

                                      <td className="px-3 py-4 text-sm text-right text-gray-500 lg:table-cell">
                                        {priceFormatter(total)}
                                      </td>

                                      <td className="px-3 py-4 text-sm flex justify-end text-gray-500">
                                        <TrashIcon
                                          className={`h-5 w-5 text-red-500 cursor-pointer ${
                                            isDeleting ? "opacity-50" : ""
                                          }`}
                                          onClick={() =>
                                            deleteOrderItem({
                                              orderItemId: item.id,
                                            })
                                          }
                                        />
                                      </td>
                                    </>
                                  )}
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>

                    {order.totalPrice && (
                      <p className="mt-4 font-semibold text-right">
                        Total order:
                        {order.currency === "USD"
                          ? `$${priceFormatter(order.totalPrice)}`
                          : order.currency === "EUR"
                          ? `${priceFormatter(
                              currencyConverter(
                                order.totalPrice,
                                "USD",
                                order.currency
                              )
                            )} €`
                          : `${priceFormatter(
                              currencyConverter(
                                order.totalPrice,
                                "USD",
                                order.currency
                              )
                            )} L`}
                      </p>
                    )}

                    <div className="flex mt-4 justify-end">
                      <button
                        id={order.id}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        disabled={isUpdating}
                        onClick={handleUpdateOrder}
                      >
                        {isUpdating ? "Updating order..." : "Update order"}
                      </button>

                      {updateOrderError && (
                        <div>
                          <p>{updateOrderError.message}</p>
                        </div>
                      )}

                      {deleteOrderItemError && (
                        <div>
                          <p>{deleteOrderItemError.message}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex mt-4 justify-end">
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          setActiveView("My Orders");

                          route("/", true);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Return to My Orders
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {(() => {
                setActiveView("My Orders");

                route("/", true);
              })()}
            </>
          )}
        </div>
      )}
    </div>
  );
};
