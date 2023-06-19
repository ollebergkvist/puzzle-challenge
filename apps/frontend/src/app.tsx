// libs
import { Router, Route } from "preact-router";

// context
import { AuthProvider, ViewToggleProvider } from "./context";

// layout
import { Layout } from "./layout";

// pages
import { CartPage, CheckoutPage, HomePage, LoginPage } from "./pages";

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
              <Route exact path="/" component={HomePage} />

              <Route path="/login" component={LoginPage} />

              <Route exact path="/cart" component={CartPage} />

              <Route path="/checkout" component={CheckoutPage} />
            </Router>
          </ViewToggleProvider>
        </Layout>
      </AuthProvider>
    </div>
  );
}
