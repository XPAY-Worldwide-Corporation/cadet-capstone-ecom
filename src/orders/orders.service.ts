import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(
    userId: number,
    orderItems: { productId: number; quantity: number }[],
    totalAmount: number
  ): Promise<Order> {
    return this.prisma.order.create({
      data: {
        userId: userId,
        status: 'Pending',
        totalAmount: totalAmount,
        orderItems: {
          create: orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });
  }

  async getOrderById(orderId: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: status },
    });
  }
}