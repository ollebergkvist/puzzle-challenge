// libs
import { route } from "preact-router";

// context
import { useAuthContext } from "../context";

// components
import { OrderDetails } from "../components";

// types
import type { JSX } from "preact/jsx-runtime";
import { OrderDetailsPageProps } from "../types";

export const OrderDetailsPage = ({
  orderId,
}: OrderDetailsPageProps): JSX.Element => {
  const { isAuthenticated } = useAuthContext();

  return (
    <>
      {isAuthenticated ? (
        <>
          <OrderDetails orderId={orderId} />
        </>
      ) : (
        (() => {
          route("/login");
        })()
      )}
    </>
  );
};
