// libs
import express from "express";

// middlewares
import { validateBody } from "../middlewares";

// schemas
import { orderItemSchema } from "../schemas";

// controllers
import { CreateCart } from "../controllers";

const router = express.Router();

router.post("/", validateBody(orderItemSchema), CreateCart);

export { router as CartRoute };
