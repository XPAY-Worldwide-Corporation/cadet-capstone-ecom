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
        inventory: true,
      },
    });
  }

  async getById(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        customer: true,
        inventory: true,
      },
    });

    if (!transaction) throw new NotFoundException("Transaction not found");

    return transaction;
  }

  async add(createTransactionDto: CreateTransactionDto) {
    const { customerId, inventoryId, productTotal, ...transactionData } =
      createTransactionDto;

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) throw new NotFoundException("Customer not found");

    return this.prisma.transaction.create({
      data: {
        ...transactionData,
        productTotal: Number(productTotal),
        customer: {
          connect: { id: customerId },
        },
        inventory: {
          connect: { id: inventoryId },
        },
      },
      include: {
        customer: true,
        inventory: true,
      },
    });
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        customer: true,
        inventory: true,
      },
    });

    if (!transaction) throw new NotFoundException("Transaction not found");

    if (updateTransactionDto.status === "Completed") {
      const inventory = await this.prisma.inventory.findUnique({
        where: { id: transaction.inventoryId },
      });

      if (!inventory) throw new NotFoundException("Inventory not found");

      await this.prisma.inventory.update({
        where: { id: inventory.id },
        data: {
          stock: inventory.stock - transaction.productTotal,
        },
      });
    }

    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...updateTransactionDto,
      },
      include: {
        customer: true,
        inventory: true,
      },
    });
  }

  async deleteById(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        customer: true,
        inventory: true,
      },
    });

    if (!transaction) throw new NotFoundException("Transaction not found");

    return this.prisma.transaction.delete({
      where: { id },
      include: {
        customer: true,
        inventory: true,
      },
    });
  }
}
