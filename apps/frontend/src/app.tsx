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

export function App() {
  return (
    <div>
      <AuthProvider>
        <Navbar />

        <Layout>
          <ViewToggleProvider>
            <Router>
              <Route path="/" component={HomePage} />

              <AsyncRoute path="/login" component={LoginPage} />

              <AsyncRoute exact path="/cart" component={CartPage} />

              <AsyncRoute
                path="/orders/:orderId"
                component={OrderDetailsPage}
              />
            </Router>
          </ViewToggleProvider>
        </Layout>
      </AuthProvider>
    </div>
  );
}
