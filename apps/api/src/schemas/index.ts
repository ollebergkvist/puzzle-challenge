// libs
import { z } from "zod";

export type LoginSchemaType = z.TypeOf<typeof loginSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type RatingSchemaType = z.TypeOf<typeof ratingSchema>;

export const ratingSchema = z.object({
  orderId: z.string().cuid(),
  rating: z.number().int().min(0).max(5),
});

export type OrderItemType = z.TypeOf<typeof orderItemSchema>;

export const orderItemSchema = z.object({
  productId: z.string(),
});

export type OrderSchemaType = z.TypeOf<typeof orderSchema>;

export const orderSchema = z.object({
  userId: z.string().cuid(),
  orderDetails: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
});

export type OrderIdSchemaType = z.TypeOf<typeof orderIdSchema>;

export const orderIdSchema = z.object({
  orderId: z.string().cuid(),
});

export type FilterSchemaType = z.TypeOf<typeof filterSchema>;

export const filterSchema = z.object({
  itemNames: z.array(z.string()).optional(),
  categoryNames: z.array(z.string()).optional(),
});

export type searchSchemaType = z.TypeOf<typeof searchSchema>;

export const searchSchema = z.object({
  itemName: z.string().optional(),
  categoryName: z.string().optional(),
  price: z.number().min(0).optional(),
});
