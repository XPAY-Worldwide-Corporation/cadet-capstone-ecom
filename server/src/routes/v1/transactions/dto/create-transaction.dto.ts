import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
} from "class-validator";

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  payment: string;

  @IsInt()
  @IsOptional()
  productTotal: number;

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  productIds: number[];

  @IsInt()
  @IsNotEmpty()
  customerId: number;
}
