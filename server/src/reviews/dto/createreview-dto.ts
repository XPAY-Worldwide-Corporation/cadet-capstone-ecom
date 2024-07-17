import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReviewDto {
    @IsNotEmpty()
    product_id: number

    user_id: number

    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    message: string

    @IsNumber()
    @IsNotEmpty()
    rate: number
}