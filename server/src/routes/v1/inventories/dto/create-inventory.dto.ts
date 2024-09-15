import { Transform } from "class-transformer";
import { IsNotEmpty, IsInt } from "class-validator";

export class CreateInventoryDto {
  @IsInt()
  @IsNotEmpty()
  stock: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  productId: number;
}
