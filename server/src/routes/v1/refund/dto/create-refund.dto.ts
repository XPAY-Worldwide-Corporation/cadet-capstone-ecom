import { Transform } from "class-transformer";
import { IsString, IsInt, IsNotEmpty } from "class-validator";

export class CreateRefundDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  transactionId: number;
}
