import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaConfigService } from 'src/config/config.prisma';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaConfigService) {}

  async create(createReviewDto: CreateReviewDto) {
    const { transactionId, productId, customerId, rating, description, image } =
      createReviewDto;

    // Convert IDs to numbers
    const transactionIdNumber = Number(transactionId);
    const productIdNumber = Number(productId);
    const customerIdNumber = Number(customerId);

    // Check if the transaction exists and is completed
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionIdNumber },
      include: { transactionLines: true }, // Include transaction lines to verify purchased products
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found.');
    }

    if (transaction.status === 'Pending') {
      throw new BadRequestException(
        'You cannot review a product from a pending transaction.',
      );
    }

    // Check if the product was included in the transaction
    const productInTransaction = transaction.transactionLines.some(
      (line) => line.productId === productIdNumber,
    );

    if (!productInTransaction) {
      throw new BadRequestException(
        'Product not found in the specified transaction.',
      );
    }

    // Check if a review already exists for this product, transaction, and customer
    const existingReview = await this.prisma.review.findFirst({
      where: {
        productId: productIdNumber,
        transactionId: transactionIdNumber,
        customerId: customerIdNumber,
      },
    });

    if (existingReview) {
      throw new BadRequestException(
        'Review already exists for this product from this transaction.',
      );
    }

    // Create the review if the transaction is not pending, product was purchased, and no existing review
    return this.prisma.review.create({
      data: {
        rating: Number(rating),
        description,
        image: JSON.stringify(image), // Convert image array to JSON
        product: { connect: { id: productIdNumber } },
        transaction: { connect: { id: transactionIdNumber } },
        customer: { connect: { id: customerIdNumber } },
      },
    });
  }

  // Retrieve all reviews
  async findAll() {
    return this.prisma.review.findMany({
      include: {
        product: true,
        transaction: true,
        customer: true,
      },
    });
  }

  // Retrieve a single review by ID
  async findOne(id: number) {
    return this.prisma.review.findUnique({
      where: { id },
      include: {
        product: true,
        transaction: true,
        customer: true,
      },
    });
  }

  // Update a review
  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const { rating, description, image } = updateReviewDto;

    return this.prisma.review.update({
      where: { id },
      data: {
        rating: rating ? Number(rating) : undefined,
        description: description ? description : undefined,
        image: image ? JSON.stringify(image) : undefined, // Convert image array to JSON if it exists
      },
    });
  }

  // Delete a review
  async remove(id: number) {
    return this.prisma.review.delete({
      where: { id },
    });
  }
}
