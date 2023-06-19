// libs
import { route } from "preact-router";

// context
import { useAuthContext } from "../context";

// components
import { Cart } from "../components";

// types
import type { JSX } from "preact/jsx-runtime";

export const SingleOrderPage = (): JSX.Element => {
  const { isAuthenticated } = useAuthContext();

  return (
    <>
      {isAuthenticated ? (
        <Cart />
      ) : (
        (() => {
          route("/login");
        })()
      )}
    </>
  );
};
