import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaConfigService } from "src/config";
import { CreateRefundDto } from "./dto/create-refund.dto";
import { UpdateRefundDto } from "./dto/update-refund.dto";

@Injectable()
export class RefundService {
  constructor(private readonly prisma: PrismaConfigService) {}

  getAll() {
    return this.prisma.refund.findMany({
      include: {
        transaction: true,
      },
    });
  }

  async getById(id: number) {
    const refund = await this.prisma.refund.findUnique({
      where: { id },
      include: {
        transaction: true,
      },
    });

    if (!refund) throw new NotFoundException("Refund not found");

    return refund;
  }

  async add(createRefundDto: CreateRefundDto) {
    const { transactionId, ...refundData } = createRefundDto;

    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) throw new NotFoundException("Transaction not found");

    if (transaction.status !== "Refund")
      throw new BadRequestException(
        "Cannot refund on a transaction that is not marked for a refund",
      );

    return this.prisma.refund.create({
      data: {
        ...refundData,
        transaction: {
          connect: { id: transactionId },
        },
      },
      include: {
        transaction: true,
      },
    });
  }

  async update(id: number, updateRefundDto: UpdateRefundDto) {
    const refund = await this.prisma.refund.findUnique({
      where: { id },
      include: {
        transaction: true,
      },
    });

    if (!refund) throw new NotFoundException("Refund not found");

    const { isRefund, transactionId } = updateRefundDto;

    const newTransactionStatus = isRefund ? "Pending" : "Cancelled";

    const updatedRefund = await this.prisma.refund.update({
      where: { id },
      data: {
        isRefund,
      },
      include: {
        transaction: true,
      },
    });

    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: newTransactionStatus,
      },
    });

    return updatedRefund;
  }

  async deleteById(id: number) {
    const refund = await this.prisma.refund.findUnique({
      where: { id },
      include: {
        transaction: true,
      },
    });

    if (!refund) throw new NotFoundException("Refund not found");

    return this.prisma.refund.delete({
      where: { id },
      include: {
        transaction: true,
      },
    });
  }
}
