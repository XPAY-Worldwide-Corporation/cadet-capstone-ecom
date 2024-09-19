import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
} from 'class-validator';
import { UploadImages } from 'src/types';

export class CreateReviewDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  transactionId: number;

  @IsInt()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  @IsOptional()
  image: UploadImages[];

  @IsInt()
  @IsNotEmpty()
  customerId: number;
}
