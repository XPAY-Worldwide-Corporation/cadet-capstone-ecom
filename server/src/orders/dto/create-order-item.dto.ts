import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer'

export class CreateOrderItemDto {

   @Transform(({ value }) => parseInt(value))
   @IsNotEmpty()
   storeId: number;

   @Transform(({ value }) => parseInt(value))
   @IsNotEmpty()
   productVarId: number;

   @Transform(({ value }) => parseInt(value))
   @IsNotEmpty()
   shippingMethodId: number;

   @Transform(({ value }) => parseInt(value))
   @IsNotEmpty()
   qty: number;


   @Transform(({ value }) => parseFloat(value.toFixed(2))) 
   @IsNotEmpty()
   pricePerUnit: number;
}