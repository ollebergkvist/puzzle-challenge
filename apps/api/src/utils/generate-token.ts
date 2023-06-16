// libs
import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  return token;
};

export default generateToken;
