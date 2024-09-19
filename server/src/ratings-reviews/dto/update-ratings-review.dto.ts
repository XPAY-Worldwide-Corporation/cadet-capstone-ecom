import { PartialType } from '@nestjs/mapped-types';
import { CreateRatingsReviewDto } from './create-ratings-review.dto';

export class UpdateRatingsReviewDto extends PartialType(CreateRatingsReviewDto) {}
