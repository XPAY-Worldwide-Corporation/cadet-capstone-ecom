import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaConfigService } from "src/config";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaConfigService) {}

  getAll() {
    return this.prisma.transaction.findMany({
      include: {
        customer: true,
        products: true,
      },
    });
  }

  async getById(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        customer: true,
        products: true,
      },
    });

    if (!transaction) throw new NotFoundException("Transaction not found");

    return transaction;
  }

  async add(createTransactionDto: CreateTransactionDto) {
    const { customerId, productIds, productTotal, ...transactionData } =
      createTransactionDto;

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) throw new NotFoundException("Customer not found");

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length === 0)
      throw new NotFoundException("Products not found");

    const totalPrice = products.reduce(
      (sum, product) => sum + product.price,
      0,
    );

    return this.prisma.transaction.create({
      data: {
        ...transactionData,
        productTotal: Number(totalPrice),
        customer: {
          connect: { id: customerId },
        },
        products: {
          connect: productIds.map((id) => ({ id })),
        },
      },
      include: {
        customer: true,
        products: true,
      },
    });
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        customer: true,
        products: true,
      },
    });

    if (!transaction) throw new NotFoundException("Transaction not found");

    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...updateTransactionDto,
      },
      include: {
        customer: true,
        products: true,
      },
    });
  }

  async deleteById(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        customer: true,
        products: true,
      },
    });

    if (!transaction) throw new NotFoundException("Transaction not found");

    return this.prisma.transaction.delete({
      where: { id },
      include: {
        customer: true,
        products: true,
      },
    });
  }
}
