// libs
import { PrismaClient } from "@prisma/client";

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

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error getting order by ID:", error);

    res.status(500).json({ error: "Internal server error" });
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
    const { id: orderId } = req.params;
    const { itemsToAdd, currency } = req.body;

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (itemsToAdd && itemsToAdd.length > 0) {
      let totalPrice = 0;

      for (const item of itemsToAdd) {
        const existingOrderItem = await prisma.orderItem.findUnique({
          where: { id: item.orderItemId },
        });

        if (existingOrderItem) {
          await prisma.orderItem.update({
            where: { id: existingOrderItem.id },
            data: {
              quantity: parseInt(item.quantity),
            },
          });

          const updatedItem = await prisma.orderItem.findUnique({
            where: { id: existingOrderItem.id },
            include: { product: true },
          });

          if (updatedItem && updatedItem.product && updatedItem.product.price) {
            totalPrice += updatedItem.quantity * updatedItem.product.price;
          } else {
            console.error(
              `Price not found for OrderItem with id ${item.orderItemId}.`
            );
          }
        } else {
          console.error(`OrderItem with id ${item.orderItemId} not found.`);
        }
      }

      const totalWithInterest = totalPrice * 1.15;

      existingOrder.totalPrice = totalWithInterest;

      await prisma.order.update({
        where: { id: existingOrder.id },
        data: { totalPrice: totalWithInterest },
      });
    }

    if (currency) {
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: { currency },
      });
    }

    const updatedOrder = await prisma.order.findUnique({
      where: { id: existingOrder.id },
      include: { items: true },
    });

    updatedOrder.totalPrice = existingOrder.totalPrice;

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);

    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const { id: orderId } = req.params;
    const { orderItemId } = req.body;

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const remainingItems = existingOrder.items.filter(
      (item) => item.id !== orderItemId
    );

    if (remainingItems.length === 0) {
      await prisma.order.update({
        where: { id: orderId },
        data: { deleted: true },
      });

      return res.status(204).end();
    } else {
      await prisma.orderItem.delete({
        where: { id: orderItemId },
      });

      return res.status(204).end();
    }
  } catch (error) {
    console.error("Error deleting order item:", error);

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
