import { Transform } from 'class-transformer';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductDto extends CreateProductDto { 
   
   @Transform(({ value }) => parseInt(value))
   @IsNotEmpty()
   orderItemStatusId: number;
   
}
