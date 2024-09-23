import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  async createReview(userId: number, productId: number, comment: string, rating: number): Promise<Review> {
    try {
      const review = this.reviewsRepository.create({
        comment,
        rating,
        user: { id: userId } as User,
        product: { id: productId } as Product,
      });
      return await this.reviewsRepository.save(review);
    } catch (error) {
      console.error('Error creating review:', error);
      throw new Error('Could not create review');
    }
  }

  async getReviewById(id: number): Promise<Review> {
    return await this.reviewsRepository.findOne({ where: { id } });
  }
}