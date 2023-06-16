// libs
import express from "express";

// controllers
import { HealthController } from "../controllers";

const router = express.Router();

router.get("/", HealthController);

export { router as HealthRoute };
