import { Transform } from "class-transformer";
import { IsNotEmpty, IsInt } from "class-validator";

export class CreateDiscountDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  customerId: number;
}
