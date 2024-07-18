import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/createreview-dto';
import { AuthenticationGuard } from '../auth/guard/authentication-guard'
import { UpdateReviewDto } from './dto/updatereview-dto';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService:ReviewsService){}

    @Post()
    @UseGuards(AuthenticationGuard)
    async create_review(@Body() data: CreateReviewDto, @Request() req){
        data.user_id = req.user.id
        return await this.reviewsService.create_review(data)
    }

    @Get('/product/:id')
    async fetch_reviews(@Param('id') id: string){
        return await this.reviewsService.fetch_reviews({product_id:parseInt(id)})
    }

    @Get(':id')
    async fetch_review(@Param('id') id: string){
        return await this.reviewsService.fetch_review({id:parseInt(id)})
    } 

    @Patch(':id')
    @UseGuards(AuthenticationGuard)
    async update_review(@Param('id') id: string, @Body() data: UpdateReviewDto){
        return await this.reviewsService.update_review(parseInt(id), data)
    }

    @Delete(':id')
    @UseGuards(AuthenticationGuard)
    async delete_review(@Param('id') id: string){
        return await this.reviewsService.delete_review(parseInt(id))
    }
}
