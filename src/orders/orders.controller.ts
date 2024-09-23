import { Controller, Get, Param, Patch, Body, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body('userId') userId: number,
    @Body('orderItems') orderItems: { productId: number; quantity: number }[],
    @Body('totalAmount') totalAmount: number
  ): Promise<Order> {
    return this.ordersService.createOrder(userId, orderItems, totalAmount);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order | null> {
    const orderId = parseInt(id, 10);
    return this.ordersService.getOrderById(orderId);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ): Promise<Order> {
    const orderId = parseInt(id, 10);
    return this.ordersService.updateOrderStatus(orderId, status);
  }
}