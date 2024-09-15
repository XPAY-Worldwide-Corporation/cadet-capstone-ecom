import { IsInt, IsString, IsNotEmpty } from "class-validator";

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  payment: string;

  @IsInt()
  @IsNotEmpty()
  productTotal: number;

  @IsInt()
  @IsNotEmpty()
  inventoryId: number;

  @IsInt()
  @IsNotEmpty()
  customerId: number;
}
