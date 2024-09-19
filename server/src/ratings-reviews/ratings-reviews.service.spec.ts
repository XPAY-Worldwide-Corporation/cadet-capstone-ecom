import { Test, TestingModule } from '@nestjs/testing';
import { RatingsReviewsService } from './ratings-reviews.service';

describe('RatingsReviewsService', () => {
  let service: RatingsReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatingsReviewsService],
    }).compile();

    service = module.get<RatingsReviewsService>(RatingsReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
