import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateProductVariationDto } from './create-product-variation.dto';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
   
   @IsString()
   @IsNotEmpty()
   prodName: string;
   
   @IsString()
   @IsNotEmpty()
   prodDesc: string;

   @IsOptional()
   @IsString()
   prodTimgUrl?: string;

   @Transform(({ value }) => parseInt(value)) 
   categoryId: number;
   
   @Transform(({ value }) => parseInt(value)) 
   @IsOptional()
   storeCategoryId?: number;

   @Transform(({ value }) => parseFloat(value.toFixed(2))) 
   @IsNotEmpty()
   pricePerUnit: number;

   @Type(() => CreateProductVariationDto)
   @ValidateNested({ each: true })
   prodVar: CreateProductVariationDto[]
}
