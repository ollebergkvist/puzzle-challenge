// libs
import express from "express";

// middlewares
import { validateBody } from "../middlewares";

// schemas
import { orderItemSchema } from "../schemas";

// controllers
import { createCart } from "../controllers";

const router = express.Router();

router.post("/", validateBody(orderItemSchema), createCart);

export { router as CartRoute };
