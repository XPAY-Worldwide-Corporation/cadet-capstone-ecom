import { Controller, Get, Post, Body, Patch, Param, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  @Get(':id')
  findOrderById(@Param('id', ParseIntPipe) id : number) {
    return this.ordersService.findOrderById(id);
  }

  @Post()
  addNewOrder(@Body(ValidationPipe) createOrderDto: CreateOrderDto) {
    return this.ordersService.addNewOrder(createOrderDto, 9);
  }

  @Patch(':id')
  updateAnOrder(@Param('id', ParseIntPipe) id : number, @Body(ValidationPipe) updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateAnOrder(id, updateOrderDto);
  }
}
