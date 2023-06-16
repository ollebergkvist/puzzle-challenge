// libs
import express from "express";

// middlewares
import { validateBody } from "../middlewares/validate-body";

// schemas
import { loginSchema } from "../schemas";

// controllers
import { LoginController } from "../controllers/login";

const router = express.Router();

router.post("/", validateBody(loginSchema), LoginController);

export { router as LoginRoute };
