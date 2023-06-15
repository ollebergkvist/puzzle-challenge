// libs
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const ratingSchema = z.object({
  rating: z.number().int().min(0).max(5),
});
