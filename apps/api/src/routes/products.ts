// libs
import express from "express";

// middlewares
import { validateBody } from "../middlewares";

// schemas
import { filterSchema, searchSchema } from "../schemas";

// controllers
import {
  getAllProducts,
  getFilteredProducts,
  searchProducts,
} from "../controllers";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/filter", validateBody(filterSchema), getFilteredProducts);
router.get("/search", validateBody(searchSchema), searchProducts);

export { router as ProductsRoutes };
