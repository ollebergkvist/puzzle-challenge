// libs
import express from "express";

// controllers
import { healthController } from "../controllers";

const router = express.Router();

router.get("/", healthController);

export { router as HealthRoute };
