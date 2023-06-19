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
  getOrders,
} from "../controllers";

const router = express.Router();

router.use(validateToken);

router.get("/", getOrders);
router.post("/create", createOrder);
router.put("/edit", validateBody(orderSchema), updateOrder);
router.put("/rate", validateBody(ratingSchema), rateOrder);
router.put("/cancel", validateBody(orderIdSchema), cancelOrder);
router.put("/pay", validateBody(orderIdSchema), payOrder);

export { router as OrdersRoutes };
