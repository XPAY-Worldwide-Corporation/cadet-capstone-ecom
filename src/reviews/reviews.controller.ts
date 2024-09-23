import { Controller, Post, Body, Get, Param, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(
    @Body('userId') userId: number,
    @Body('productId') productId: number,
    @Body('comment') comment: string,
    @Body('rating') rating: number,
  ): Promise<Review> {
    try {
      return await this.reviewsService.createReview(userId, productId, comment, rating);
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getReview(@Param('id') id: number): Promise<Review> {
    const review = await this.reviewsService.getReviewById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }
}