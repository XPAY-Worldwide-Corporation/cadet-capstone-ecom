import { PartialType } from "@nestjs/mapped-types";
import { CreateInventoryDto } from "./create-inventory.dto";
import { IsNotEmpty, IsInt } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
  @IsInt()
  @IsNotEmpty()
  stock: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  productId: number;
}
