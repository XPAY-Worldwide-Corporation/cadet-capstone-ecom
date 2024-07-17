import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateReviewDto {
    title: string

    message: string

    @IsNumber()
    rate: number
}