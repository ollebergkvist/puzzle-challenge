// libs
import { PrismaClient } from "@prisma/client";

// types
import type { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();

    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const getFilteredProducts = async (req: Request, res: Response) => {
  try {
    const { itemName, categoryName } = req.query;

    let whereClause = {};

    if (itemName) {
      whereClause.title = { in: itemName.split(",") };
    }

    if (categoryName) {
      whereClause.category = { in: categoryName.split(",") };
    }

    const filteredProducts = await prisma.product.findMany({
      where: whereClause,
    });

    res.json(filteredProducts);
  } catch (error) {
    console.error("Error retrieving filtered products:", error);

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    let parsedPrice = parseFloat(query);

    const filteredProducts = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          {
            price: isNaN(parsedPrice)
              ? undefined
              : query.includes(".")
              ? parsedPrice
              : {
                  gte: parsedPrice,
                  lt: Math.floor(parsedPrice) + 1,
                },
          },
        ],
      },
    });

    if (filteredProducts.length === 0) {
      return res.status(404).json({ message: "No products found." });
    }

    res.json(filteredProducts);
  } catch (error) {
    console.error("Error retrieving filtered products:", error);

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};
