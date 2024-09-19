import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { CreateOrderItemDto  } from "./create-order-item.dto";

export class CreateOrderDto {
   
   @Transform(({ value }) => parseInt(value))
   @IsNotEmpty()
   customerAddressId: number;

   @Transform(({ value }) => parseInt(value))
   @IsNotEmpty()
   paymentMethodId: number;

   @Transform(({ value }) => parseInt(value))
   @IsNotEmpty()
   paymentStatusId: number;

   @Transform(({ value }) => parseFloat(value.toFixed(2)))
   @IsNotEmpty()
   subtotal: number;

   @Transform(({ value }) => parseFloat(value.toFixed(2))) 
   @IsNotEmpty()
   @IsOptional()
   discount?: number = 0.00;

   @Transform(({ value }) => parseFloat(value.toFixed(2))) 
   @IsNotEmpty()
   totalShippingFee: number;

   @Type(() => CreateOrderItemDto)
   @ValidateNested({ each: true })
   orderItems: CreateOrderItemDto[]
}
