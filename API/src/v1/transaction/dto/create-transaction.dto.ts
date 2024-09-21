import {
  IsInt,
  IsOptional,
  IsArray,
  IsString,
  IsNotEmpty,
} from 'class-validator';

class TransactionLineDto {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;
}

export class CreateTransactionDto {
  @IsInt()
  customerId: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsOptional()
  @IsInt()
  discountId?: number;

  @IsArray()
  transactionLines: TransactionLineDto[];
}
