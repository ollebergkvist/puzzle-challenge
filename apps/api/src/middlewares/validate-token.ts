// libs
import jwt from "jsonwebtoken";

// types
import type { Request, Response, NextFunction } from "express";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    req.user = {
      ...decoded,
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    console.error("Token validation error:", error);

    return res.status(401).json({ error: "Invalid token" });
  }
};
