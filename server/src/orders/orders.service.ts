import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prismaService : PrismaService) {}

  async findAllOrders() {
    return await this.prismaService.order.findMany();
  }

  async findOrderById(id: number) {
    return await this.prismaService.order.findMany({
      where: { id : id }
    });
  }

  async addNewOrder(createOrderDto: CreateOrderDto, customerId: number) {
    return await this.prismaService.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customerId: customerId,
          customerAddressId: createOrderDto.customerAddressId,
          paymentMethodId: createOrderDto.paymentMethodId,
          paymentStatusId: createOrderDto.paymentStatusId,
          subtotal: createOrderDto.subtotal,
          discount: createOrderDto.discount,
          totalShippingFee: createOrderDto.totalShippingFee
        }
      });

      const orderItems = createOrderDto.orderItems.map(async (o) => {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productVarId: o.productVarId,
            shippingMethodId: o.shippingMethodId,
            orderItemStatusId: 1,
            qty: o.qty,
            storeId: o.storeId,
            pricePerUnit: o.pricePerUnit
          }
        })
      });

      return Promise.all(orderItems);
    });
  }


  async updateAnOrder(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.prismaService.order.update({
      where: { id : id },
      data : {
        paymentStatusId: updateOrderDto.paymentStatusId
      }
    });
  }

}
