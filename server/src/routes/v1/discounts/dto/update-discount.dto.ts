import { PartialType } from "@nestjs/mapped-types";
import { CreateDiscountDto } from "./create-discount.dto";
import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty } from "class-validator";

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {
  @IsBoolean()
  isAccepted: boolean;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  merchantId: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  customerId: number;
}
