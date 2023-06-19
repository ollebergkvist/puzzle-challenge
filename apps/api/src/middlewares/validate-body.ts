// libs
import type { ZodSchema } from "zod";

// types
import type { Request, Response, NextFunction } from "express";

export const validateBody = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validatedBody = schema.safeParse(req.body);

    if (!validatedBody.success) {
      console.log(validatedBody.error);
      return res.status(400).json({ message: validatedBody.error });
    }

    next();
  };
};
