import { Test, TestingModule } from '@nestjs/testing';
import { RatingsReviewsController } from './ratings-reviews.controller';
import { RatingsReviewsService } from './ratings-reviews.service';

describe('RatingsReviewsController', () => {
  let controller: RatingsReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingsReviewsController],
      providers: [RatingsReviewsService],
    }).compile();

    controller = module.get<RatingsReviewsController>(RatingsReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
