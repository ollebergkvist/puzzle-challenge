// libs
import express from "express";

// middlewares
import { validateBody, validateToken } from "../middlewares";

// schemas
import { orderIdSchema, orderSchema, ratingSchema } from "../schemas";

// controllers
import { OrderRating, CancelOrder, CreateOrder } from "../controllers";

const router = express.Router();

router.use(validateToken);

router.post("/orders/create", validateBody(orderSchema), CreateOrder);
router.post(
  "/orders/:orderId/ratings",
  validateBody(ratingSchema),
  OrderRating
);
router.post(
  "/orders/:orderId/cancel",
  validateBody(orderIdSchema),
  CancelOrder
);

export { router as OrdersRoutes };
