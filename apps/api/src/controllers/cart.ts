// libs
import { PrismaClient } from "@prisma/client";

// types
import type { Request, Response } from "express";

type User = {
  userId: string;
};

interface CreateCartRequest extends Request {
  user: User;
}

const prisma = new PrismaClient();

export const createCart = async (req: CreateCartRequest, res: Response) => {
  const { productId } = req.body;
  const { userId } = req.user;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingCart = await prisma.cart.findFirst({
      where: {
        userId,
      },
    });

    let cartId: string;

    if (existingCart) {
      cartId = existingCart.id;
    } else {
      const newCart = await prisma.cart.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      cartId = newCart.id;
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + 1,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cart: {
            connect: {
              id: cartId,
            },
          },
          product: {
            connect: {
              id: productId,
            },
          },
          quantity: 1,
        },
      });
    }

    return res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding item to cart:", error);

    return res.status(500).json({ error: "An unexpected error occurred" });
  } finally {
    await prisma.$disconnect();
  }
};

export const getCartItems = async (req: Request, res: Response) => {
  const { userId } = req.user;

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        cart: {
          userId,
        },
      },
      include: {
        product: true,
      },
    });

    return res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error retrieving cart items:", error);

    return res.status(500).json({ error: "An unexpected error occurred" });
  } finally {
    await prisma.$disconnect();
  }
};
