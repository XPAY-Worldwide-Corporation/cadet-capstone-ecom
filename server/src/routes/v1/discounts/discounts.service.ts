import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaConfigService } from "src/config";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { UpdateDiscountDto } from "./dto/update-discount.dto";

@Injectable()
export class DiscountsService {
  constructor(private readonly prisma: PrismaConfigService) {}

  getAll() {
    return this.prisma.discount.findMany({
      include: {
        customer: true,
        merchant: true,
      },
    });
  }

  async getById(id: number) {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
      include: {
        customer: true,
        merchant: true,
      },
    });

    if (!discount) throw new NotFoundException("Discount not found");

    return discount;
  }

  async add(createDiscountDto: CreateDiscountDto) {
    const { customerId } = createDiscountDto;

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) throw new NotFoundException("Customer not found");

    return this.prisma.discount.create({
      data: {
        customer: {
          connect: { id: customerId },
        },
      },
      include: {
        customer: true,
        merchant: true,
      },
    });
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
      include: {
        customer: true,
        merchant: true,
      },
    });

    if (!discount) throw new NotFoundException("Discount not found");

    const { customerId, merchantId, isAccepted } = updateDiscountDto;

    return this.prisma.discount.update({
      where: { id },
      data: {
        isAccepted: isAccepted,
        customer: {
          connect: { id: customerId },
        },
        merchant: {
          connect: { id: merchantId },
        },
      },
      include: {
        customer: true,
        merchant: true,
      },
    });
  }

  async deleteById(id: number) {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
      include: {
        customer: true,
        merchant: true,
      },
    });

    if (!discount) throw new NotFoundException("Discount not found");

    return this.prisma.discount.delete({
      where: { id },
      include: {
        customer: true,
        merchant: true,
      },
    });
  }
}
