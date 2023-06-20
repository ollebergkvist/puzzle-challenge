// libs
import { route } from "preact-router";
import { useEffect } from "preact/hooks";
import { useAuthContext } from "./context";
import AsyncRoute from "preact-async-route";

export const ProtectedRoute = ({ component: Component, path, ...rest }) => {
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated) {
      route("/login");
    }
  }, [isAuthenticated]);

  return (
    <AsyncRoute
      path={path}
      {...rest}
      component={(props) => (isAuthenticated ? <Component {...props} /> : null)}
    />
  );
};
