// libs
import express from "express";

// controllers
import { getAllProducts } from "../controllers";

const router = express.Router();

router.get("/", getAllProducts);

export { router as ProductsRoutes };
