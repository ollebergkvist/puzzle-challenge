// libs
import { route } from "preact-router";
import { useAuthContext } from "./context";
import AsyncRoute from "preact-async-route";

export const ProtectedRoute = ({ component: Component, path, ...rest }) => {
  const { isAuthenticated } = useAuthContext();

  return (
    <AsyncRoute
      path={path}
      {...rest}
      component={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          (() => {
            route("/login");
          })()
        )
      }
    />
  );
};
