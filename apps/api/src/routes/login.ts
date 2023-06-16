// libs
import express from "express";

// middlewares
import { validateBody } from "../middlewares";

// schemas
import { loginSchema } from "../schemas";

// controllers
import { LoginController } from "../controllers";

const router = express.Router();

router.post("/", validateBody(loginSchema), LoginController);

export { router as LoginRoute };
