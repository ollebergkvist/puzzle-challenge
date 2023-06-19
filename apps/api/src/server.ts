// libs
import express from "express";

// middlewares
import { registerGlobalMiddlewares } from "./middlewares";

// routes
import {
  OrdersRoutes,
  LoginRoute,
  ProductsRoutes,
  HealthRoute,
  CartRoute,
} from "./routes";

export const createServer = () => {
  const app = express();

  registerGlobalMiddlewares(app);

  app.use("/api/health", HealthRoute);
  app.use("/api/login", LoginRoute);
  app.use("/api/orders", OrdersRoutes);
  app.use("/api/products", ProductsRoutes);
  app.use("/api/cart", CartRoute);

  return app;
};
