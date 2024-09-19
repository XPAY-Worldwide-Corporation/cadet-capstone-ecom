import { Transform } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductVariationDto {

   @Transform(({ value }) => parseInt(value))
   @IsOptional()
   productId?: number
   
   @Transform(({ value }) => parseFloat(value.toFixed(2))) 
   @IsNotEmpty()
   prodHeight: number;

   @Transform(({ value }) => parseFloat(value.toFixed(2))) 
   @IsNotEmpty()
   prodWidth: number;

   @IsNotEmpty()
   @IsString()
   color: string;

   @IsNotEmpty()
   @IsString()
   size: string;

   @Transform(({ value }) => parseInt(value))
   @IsOptional()
   stockNo?: number = 0;
}