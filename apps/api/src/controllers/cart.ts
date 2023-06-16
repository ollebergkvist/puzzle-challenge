// libs
import { PrismaClient } from "@prisma/client";

export const CreateCart = async (req, res) => {
  const { productId, productName, productPrice, quantity } = req.body;
  const userId = req.user.id;

  const prisma = new PrismaClient();

  try {
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userId,
        productId,
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cart: {
            connect: {
              id: userId,
            },
          },
          product: {
            create: {
              name: productName,
              price: productPrice,
            },
          },
          quantity,
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
