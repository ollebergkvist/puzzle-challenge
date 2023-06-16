// libs
import express from "express";

// middlewares
import { validateBody, validateToken } from "../middlewares";

// schemas
import { orderIdSchema, orderSchema, ratingSchema } from "../schemas";

// controllers
import {
  rateOrder,
  cancelOrder,
  createOrder,
  updateOrder,
  payOrder,
} from "../controllers";

const router = express.Router();

router.use(validateToken);

router.post("/orders/create", validateBody(orderSchema), createOrder);
router.put("/orders/:orderId", validateBody(orderSchema), updateOrder);
router.post("/orders/:orderId/rate", validateBody(ratingSchema), rateOrder);
router.post(
  "/orders/:orderId/cancel",
  validateBody(orderIdSchema),
  cancelOrder
);
router.put("/orders/:orderId/pay", validateBody(orderIdSchema), payOrder);

export { router as OrdersRoutes };
