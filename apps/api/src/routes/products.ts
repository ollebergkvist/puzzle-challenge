// libs
import express from "express";

// controllers
import { GetAllProducts } from "../controllers/products";

const router = express.Router();

router.get("/", GetAllProducts);

export { router as ProductsRoutes };
