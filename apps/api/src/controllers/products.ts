// libs
import { PrismaClient } from "@prisma/client";

export const GetAllProducts = async (req, res) => {
  try {
    const prisma = new PrismaClient();

    const products = await prisma.product.findMany();

    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};
