import { Module } from '@nestjs/common';
import { RatingsReviewsService } from './ratings-reviews.service';
import { RatingsReviewsController } from './ratings-reviews.controller';

@Module({
  controllers: [RatingsReviewsController],
  providers: [RatingsReviewsService],
})
export class RatingsReviewsModule {}
