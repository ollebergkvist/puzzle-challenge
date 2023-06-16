// libs
import express from "express";

// middlewares
import { validateBody } from "../middlewares";

// schemas
import { loginSchema } from "../schemas";

// controllers
import { loginController } from "../controllers";

const router = express.Router();

router.post("/", validateBody(loginSchema), loginController);

export { router as LoginRoute };
