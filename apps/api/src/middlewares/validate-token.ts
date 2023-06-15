// libs
import jwt from "jsonwebtoken";

export const validateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN as string);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token validation error:", error);

    return res.status(401).json({ error: "Invalid token" });
  }
};
