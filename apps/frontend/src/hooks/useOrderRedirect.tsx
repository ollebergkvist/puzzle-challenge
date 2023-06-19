// libs
import { route } from "preact-router";

export const useOrderRedirect = () => {
  const redirectToOrder = (orderId: string) => {
    route(`/orders/${orderId}`, true);
  };

  return redirectToOrder;
};
