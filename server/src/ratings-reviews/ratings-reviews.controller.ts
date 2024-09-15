import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RatingsReviewsService } from './ratings-reviews.service';
import { CreateRatingsReviewDto } from './dto/create-ratings-review.dto';

@Controller('ratings-reviews')
export class RatingsReviewsController {
  constructor(private readonly ratingsReviewsService: RatingsReviewsService) {}

  @Get()
  getAllRatings(@Query('prod') prodId: number) {
    return prodId;
  }
  
  @Get()
  getAllRatingsAndReviewsOfProd(@Query('prod') prodId: number) {
    return prodId;
  }

  @Post()
  addRatingAndReviewToProduct(@Body() createRatingsReviewDto: CreateRatingsReviewDto) {
    return this.ratingsReviewsService.create(createRatingsReviewDto);
  }

  @Get(':rating_review_id')
  getRatingAndReviewById(@Param('rating_review_id') ratingReviewId: number) {
    return this.ratingsReviewsService.findOne(ratingReviewId);
  }
}
