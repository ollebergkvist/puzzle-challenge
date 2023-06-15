// libs
import express from "express";
import morgan from "morgan";
import cors from "cors";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

// utils
import { comparePasswords } from "./utils/compare-passwords";

export const createServer = () => {
  const app = express();

  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors());
  app
    .post("/login", async (req, res) => {
      const schema = z.object({
        email: z.string().min(1),
        password: z.string().email(),
      });

      const validatedBody = schema.safeParse(req.body);

      if (!validatedBody.success) {
        res.send(400).end(validatedBody.error);
      }

      const { email, password } = req.body;

      const prisma = new PrismaClient();

      try {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const passwordsMatch = comparePasswords(password, user.password);

        if (!passwordsMatch) {
          return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ userId: user.id }, "your-secret-key", {
          expiresIn: "1h",
        });

        return res.json({ token });
      } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "An unexpected error occurred" });
      }
    })
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/healthz", (req, res) => {
      return res.json({ ok: true });
    });

  return app;
};
