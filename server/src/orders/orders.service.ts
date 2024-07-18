import { BadRequestException, Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) { }

    async fetch_total(cart_id: number): Promise<number> {
        try {
            const cart_products = await this.prisma.prismaClient.cartProduct.findMany({ where: { cart_id } })
            let total = 0

            const promises = cart_products.map(async ({ quantity, product_id }) => {
                const { price } = await this.prisma.prismaClient.product.findFirst({ where: { id: product_id } });
                total += (price * quantity)
            });

            await Promise.all(promises);
            return total
        } catch (error) {
            console.log(error.message)
            throw new BadRequestException('There was an ERROR calculating the total price')
        }
    }

    async order_exist(query: Object): Promise<Boolean> {
        const res = await this.prisma.prismaClient.order.findFirst({ where: query })
        if (res) return true
        return false
    }

    async create_order(data): Promise<Order> {
        try {
            return await this.prisma.prismaClient.order.create({ data })
        } catch (error) {
            console.log(error)
            throw new BadRequestException('There was an ERROR creating the order')
        }
    }

    async fetch_orders(query: Object): Promise<Order[]> {
        try {
            return await this.prisma.prismaClient.order.findMany({ where: query })
        } catch (error) {
            throw new BadRequestException('There was an ERROR fetching the orders')
        }
    }

    async fetch_order(query: Object): Promise<Order> {
        try {
            return await this.prisma.prismaClient.order.findFirst({ where: query })
        } catch (error) {
            throw new BadRequestException('There was an ERROR fetching the order')
        }
    }

    async update_order(id: number, data): Promise<Order> {
        try {
            return await this.prisma.prismaClient.order.update({ where: { id }, data })
        } catch (error) {
            throw new BadRequestException('There was an ERROR updating the order')
        }
    }

    async delete_order(id: number): Promise<Order> {
        try {
            return await this.prisma.prismaClient.order.delete({ where: { id } })
        } catch (error) {
            throw new BadRequestException('There was an ERROR deleting the order')
        }
    }
}
