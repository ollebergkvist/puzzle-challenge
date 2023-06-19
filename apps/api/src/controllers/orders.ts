// libs
import { PrismaClient } from "@prisma/client";

// utils
import { currencyConverter } from "../utils";

// types
import type { Request, Response } from "express";

const prisma = new PrismaClient();

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { status, rating, sortBy } = req.query;

    let ordersQuery = {
      where: {
        userId: userId,
        deleted: false,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {},
    };

    if (status) {
      const statusArray = (status as string).split(",");
      ordersQuery.where.status = {
        in: statusArray,
      };
    }

    if (sortBy === "asc" || sortBy === "desc") {
      ordersQuery.orderBy = {
        totalPrice: sortBy,
      };
    }

    const orders = await prisma.order.findMany(ordersQuery);

    if (rating) {
      const filteredOrders = orders.filter(
        (order) => order.rating === parseInt(rating as string)
      );
      res.json(filteredOrders);
    } else {
      res.json(orders);
    }
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const rateOrder = async (req: Request, res: Response) => {
  const { orderId, rating } = req.body;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { rating },
    });

    return res.status(204).end();
  } catch (error) {
    console.error("Error submitting rating:", error);

    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;

    const cart = await prisma.cart.findFirst({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const totalPrice = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );
    const totalWithInterest = totalPrice * 1.15;

    const order = await prisma.order.create({
      data: {
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { connect: { id: userId } },
        items: {
          create: cart.items.map((item) => ({
            product: { connect: { id: item.product.id } },
            quantity: item.quantity,
          })),
        },
        status: "ACTIVE",
        totalPrice: totalWithInterest,
      },
      include: {
        items: true,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    res.json(order);
  } catch (error) {
    console.error("Error during checkout:", error);

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const { userId } = req.user;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === "COMPLETED") {
      return res.status(400).json({ error: "Cannot cancel a completed order" });
    }

    const canceledOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        deleted: true,
      },
    });

    res.json({ message: "Order canceled successfully." });
  } catch (error) {
    console.error("Error canceling order:", error);

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { itemsToAdd, itemsToRemove, currency } = req.body;

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (itemsToAdd && itemsToAdd.length > 0) {
      const createItems = itemsToAdd.map((item) => ({
        product: { connect: { id: item.productId } },
        quantity: item.quantity,
      }));

      await prisma.orderItem.createMany({
        data: createItems,
        skipDuplicates: true,
      });
    }

    if (itemsToRemove && itemsToRemove.length > 0) {
      const itemIdsToRemove = itemsToRemove.map((item) => item.itemId);

      await prisma.orderItem.deleteMany({
        where: {
          id: { in: itemIdsToRemove },
          orderId: existingOrder.id,
        },
      });
    }

    if (currency) {
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: { currency },
      });
    }

    if (currency && currency !== existingOrder.currency) {
      existingOrder.items.forEach((item) => {
        item.price = currencyConverter(
          item.price,
          existingOrder.currency,
          currency
        );
      });
    }

    const updatedOrder = await prisma.order.findUnique({
      where: { id: existingOrder.id },
      include: { items: true },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const payOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === "COMPLETED") {
      return res.status(400).json({ error: "Order has already been paid" });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED", rating: 0 },
    });

    res.json({ message: "Order payment successful" });
  } catch (error) {
    console.error("Error processing order payment:", error);

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};
