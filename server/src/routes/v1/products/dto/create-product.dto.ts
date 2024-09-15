import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, IsInt, IsNumber } from "class-validator";
import { UploadImages } from "src/types";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  product_name: string;

  isNew: boolean;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  price: number;

  image: UploadImages[];

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  merchantId: number;
}
