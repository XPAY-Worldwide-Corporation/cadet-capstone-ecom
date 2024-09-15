import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaConfigService } from "src/config";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaConfigService) {}

  getAll() {
    return this.prisma.comment.findMany({
      include: {
        transaction: true,
      },
    });
  }

  async getById(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        transaction: true,
      },
    });

    if (!comment) throw new NotFoundException("Comment not found");

    return comment;
  }

  async add(createCommentDto: CreateCommentDto) {
    const { transactionId, image, ...commentData } = createCommentDto;

    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) throw new NotFoundException("Transaction not found");

    if (transaction.status !== "Completed")
      throw new BadRequestException(
        "Cannot comment on a transaction that is not completed",
      );

    return this.prisma.comment.create({
      data: {
        ...commentData,
        image: JSON.stringify(image),
        transaction: {
          connect: { id: transactionId },
        },
      },
      include: {
        transaction: true,
      },
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        transaction: true,
      },
    });

    if (!comment) throw new NotFoundException("Comment not found");

    const { transactionId, ratings, image, ...commentData } = updateCommentDto;

    return this.prisma.comment.update({
      where: { id },
      data: {
        ...commentData,
        ratings: Number(ratings),
        image: JSON.stringify(image),
        transaction: {
          connect: { id: transactionId },
        },
      },
      include: {
        transaction: true,
      },
    });
  }

  async deleteById(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        transaction: true,
      },
    });

    if (!comment) throw new NotFoundException("Comment not found");

    return this.prisma.comment.delete({
      where: { id },
      include: {
        transaction: true,
      },
    });
  }
}
