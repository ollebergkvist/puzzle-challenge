// libs
import { PrismaClient } from "@prisma/client";

// utils
import { comparePasswords, generateToken } from "../utils";

// types
import type { Request, Response } from "express";

export const loginController = async (req: Request, res: Response) => {
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

    const passwordsMatch = await comparePasswords(password, user.password);

    if (!passwordsMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = generateToken(user.id);

    return res.json({ token: token });
  } catch (error) {
    console.error("Error during login:", error);

    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};
