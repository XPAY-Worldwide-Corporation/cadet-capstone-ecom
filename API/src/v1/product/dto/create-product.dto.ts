import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsInt } from 'class-validator';
import { UploadImages } from 'src/types';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  price: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  image: UploadImages[];
}
