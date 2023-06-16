// libs
import { PrismaClient } from "@prisma/client";

// utils
import { currencyConverter } from "../utils";

const prisma = new PrismaClient();

export const OrderRating = async (req, res) => {
  const { orderId } = req.params;
  const { rating } = req.body;

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

export const CreateOrder = async (req, res) => {
  try {
    const { userId, orderDetails } = req.body;

    const totalPrice = orderDetails.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    const totalWithInterest = totalPrice * 1.15;

    const order = await prisma.order.create({
      data: {
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { connect: { id: userId } },
        items: {
          create: orderDetails.map((item) => ({
            product: { connect: { id: item.productId } },
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

    res.json(order);
  } catch (error) {
    console.error("Error during checkout:", error);

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const CancelOrder = async (req, res) => {
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

export const UpdateOrder = async (req, res) => {
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
