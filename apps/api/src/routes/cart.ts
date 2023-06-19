// libs
import express from "express";

// middlewares
import { validateBody, validateToken } from "../middlewares";

// schemas
import { orderItemSchema } from "../schemas";

// controllers
import { createCart, getCartItems } from "../controllers";

const router = express.Router();

router.use(validateToken);

router.get("/items", getCartItems);
router.post("/", validateBody(orderItemSchema), createCart);

export { router as CartRoute };
