import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsInt, IsDate } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsNotEmpty()
  value: number;

  @IsDate()
  @IsNotEmpty()
  start_date: Date;

  @IsDate()
  @IsNotEmpty()
  end_date: Date;
}
