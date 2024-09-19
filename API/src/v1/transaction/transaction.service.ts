import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaConfigService } from 'src/config/config.prisma';
import { v4 as uuidv4 } from "uuid";
const sdk = require("api")("@paymaya/v5.18#1bmd73pl9p4h9zf");


@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaConfigService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const {
      customerId,
      transactionLines,
      paymentMethod,
      discountId,
      ...transactions
    } = createTransactionDto;

    // Calculate total price of the transaction
    let productTotal = 0;
    let products = []; // To store product details for PayMaya

    for (const line of transactionLines) {
      const product = await this.prisma.product.findUnique({
        where: { id: line.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${line.productId} not found`,
        );
      }

      // Check if there's enough stock
      if (product.quantity < line.quantity) {
        throw new BadRequestException(`Not enough stock for product ${product.name}`);
      }

      // Add to the total price
      const lineTotal = product.price * line.quantity;
      productTotal += lineTotal;

      // Add product details for PayMaya
      products.push({
        name: product.name,
        description: product.description || "Service Description",
        quantity: line.quantity,
        totalAmount: { value: (product.price * line.quantity) }, // Use product price directly
      });
    }

    // Apply discount if available
    let discountValue = 0;
    if (discountId) {
      const discount = await this.prisma.discount.findUnique({
        where: { id: discountId },
      });
      if (discount) {
        discountValue = discount.value;
        productTotal -= discountValue;
      }
    }

    // Create the transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        ...transactions,
        paymentMethod,
        customerId,
        productTotal,
        discountId,
        status: 'Pending',
        transactionLines: {
          create: transactionLines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
          })),
        },
      },
    });

    // PayMaya integration
    if (paymentMethod === "PayMaya") {
      sdk.auth(
        "pk-NCLk7JeDbX1m22ZRMDYO9bEPowNWT5J4aNIKIbcTy2a",
        "sk-8MqXdZYWV9UJB92Mc0i149CtzTWT7BYBQeiarM27iAi",
      );
      sdk.server("https://pg-sandbox.paymaya.com/checkout/v1/checkouts");

      const uuid = uuidv4();
      const formattedUuid = uuid
        .replace(/-/g, "") // Remove dashes
        .slice(0, 24) // Use only the first 24 characters
        .toUpperCase(); // Convert to uppercase

      const { data } = await sdk.createV1Checkout({
        totalAmount: {
          value: productTotal,
          currency: "PHP",
          details: {
            subtotal: productTotal + discountValue, // Correct subtotal calculation
            discount: discountValue,
          },
        },
        items: products,
        requestReferenceNumber: formattedUuid,
      });

      return { transaction, checkoutUrl: data.redirectUrl };
    }

    return transaction;
  }

  async completeTransaction(transactionId: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { transactionLines: true },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found`,
      );
    }

    // Deduct quantities from the product stock
    for (const line of transaction.transactionLines) {
      const product = await this.prisma.product.findUnique({
        where: { id: line.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${line.productId} not found`,
        );
      }

      const newQuantity = product.quantity - line.quantity;

      if (newQuantity < 0) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      await this.prisma.product.update({
        where: { id: product.id },
        data: { quantity: newQuantity },
      });
    }

    // Update transaction status to complete
    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'Complete' },
    });
  }

  async findAll() {
    return this.prisma.transaction.findMany({
      include: {
        customer: true,
        transactionLines: {
          include: { product: true },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        customer: true,
        transactionLines: {
          include: { product: true },
        },
      },
    });
  }
}
