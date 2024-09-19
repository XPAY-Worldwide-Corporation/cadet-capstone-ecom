import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsInt, IsOptional, IsArray, IsString } from 'class-validator';

class UpdateTransactionLineDto {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsOptional()
  @IsString()
  status?: string; // Status can be updated, e.g., from 'Pending' to 'Complete'

  @IsOptional()
  @IsInt()
  discountId?: number; // You can update or apply a discount

  @IsOptional()
  @IsArray()
  transactionLines?: UpdateTransactionLineDto[]; // Allow updating transaction lines (quantities or products)
}
