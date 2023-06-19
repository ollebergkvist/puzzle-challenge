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

    const orders = await prisma.order.findMany({
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

    res.json(orders);
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

    const existingOrder = await prisma.order.findFirst({
      where: {
        userId: userId,
        status: "ACTIVE",
      },
    });

    if (existingOrder) {
      return res
        .status(400)
        .json({ error: "User already has an active order" });
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

    await prisma.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        status: "ARCHIVED",
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
    const { orderId } = req.params;
    const userId = req.user.id;

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

    await prisma.order.delete({
      where: {
        id: orderId,
      },
      include: {
        items: true,
      },
    });

    res.json({ message: "Order canceled successfully. Cart cleaned." });
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
