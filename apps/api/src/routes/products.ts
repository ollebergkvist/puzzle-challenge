// libs
import express from "express";

// controllers
import { GetAllProducts } from "../controllers";

const router = express.Router();

router.get("/", GetAllProducts);

export { router as ProductsRoutes };
