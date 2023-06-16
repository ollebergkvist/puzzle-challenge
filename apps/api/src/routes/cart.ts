// libs
import express from "express";

// middlewares
import { validateBody } from "../middlewares/validate-body";

// schemas
import { orderItemSchema } from "../schemas";

// controllers
import { CreateCart } from "../controllers/cart";

const router = express.Router();

router.post("/", validateBody(orderItemSchema), CreateCart);

export { router as CartRoute };
