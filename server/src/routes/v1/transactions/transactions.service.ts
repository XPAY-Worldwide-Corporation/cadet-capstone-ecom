import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaConfigService } from "src/config";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { v4 as uuidv4 } from "uuid";
const sdk = require("api")("@paymaya/v5.18#1bmd73pl9p4h9zf");
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
    const {
      customerId,
      productIds,
      payment,
      productTotal,
      ...transactionData
    } = createTransactionDto;

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

    const transaction = await this.prisma.transaction.create({
      data: {
        ...transactionData,
        payment,
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

    if (payment === "Maya") {
      sdk.auth(
        "pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah",
        "sk-X8qolYjy62kIzEbr0QRK1h4b4KDVHaNcwMYk39jInSl",
      );
      sdk.server("https://pg-sandbox.paymaya.com/checkout/v1/checkouts");

      const uuid = uuidv4();
      const formattedUuid = uuid
        .replace(/-/g, "")
        .slice(0, 32)
        .replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, "$1-$2-$3-$4-$5");

      const { data } = await sdk.createV1Checkout({
        totalAmount: {
          value: totalPrice,
          currency: "PHP",
        },
        buyer: {
          firstName: customer.first_name,
          lastName: customer.last_name,
        },
        items: products.map((product) => ({
          name: product.product_name,
          totalAmount: { value: product.price },
        })),
        requestReferenceNumber: formattedUuid,
      });

      return { transaction, checkoutUrl: data.redirectUrl };
    }

    return transaction;
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
