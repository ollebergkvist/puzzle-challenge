// libs
import { z } from "zod";

export type LoginSchemaType = z.TypeOf<typeof loginSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type RatingSchemaType = z.TypeOf<typeof ratingSchema>;

export const ratingSchema = z.object({
  rating: z.number().int().min(0).max(5),
});

export type OrderItemType = z.TypeOf<typeof orderItemSchema>;

export const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  productPrice: z.number().positive(),
  quantity: z.number().int().positive(),
});

export type OrderSchemaType = z.TypeOf<typeof orderSchema>;

export const orderSchema = z.object({
  userId: z.string(),
  orderDetails: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
});

export type OrderIdSchemaType = z.TypeOf<typeof orderIdSchema>;

export const orderIdSchema = z.string();
