// libs
import { Router, Route } from "preact-router";
import AsyncRoute from "preact-async-route";

// context
import { AuthProvider, ViewToggleProvider } from "./context";

// layout
import { Layout } from "./layout";

// pages
import { CartPage, HomePage, LoginPage, OrderDetailsPage } from "./pages";

// components
import { Navbar } from "./components";
import { ProtectedRoute } from "./protected-route";

export function App() {
  return (
    <div>
      <AuthProvider>
        <ViewToggleProvider>
          <Navbar />

          <Layout>
            <Router>
              <Route path="/" component={HomePage} />

              <AsyncRoute path="/login" component={LoginPage} />

              <ProtectedRoute path="/cart" component={CartPage} />

              <ProtectedRoute
                path="/orders/:orderId"
                component={OrderDetailsPage}
              />
            </Router>
          </Layout>
        </ViewToggleProvider>
      </AuthProvider>
    </div>
  );
}
