// components
import { OrderDetails } from "../components";

// types
import type { JSX } from "preact/jsx-runtime";
import { OrderDetailsPageProps } from "../types";

export const OrderDetailsPage = ({
  orderId,
}: OrderDetailsPageProps): JSX.Element => {
  return <OrderDetails orderId={orderId} />;
};
