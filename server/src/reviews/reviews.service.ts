import { BadRequestException, Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ReviewsService {
    constructor(private readonly prisma:PrismaService){}

    async review_exist(query:Object):Promise<Boolean>{
        const res = await this.prisma.prismaClient.review.findFirst({where:query})
        if(res) return true
        return false
    }

    async create_review(data): Promise<Review>{
        try {
            return await this.prisma.prismaClient.review.create({data})
        } catch (error) {   
            throw new BadRequestException('There was an ERROR creating your review')
        }
    }

    async fetch_reviews(query:Object): Promise<Review[]>{
        try {
            return await this.prisma.prismaClient.review.findMany({where:query})
        } catch (error) {
            throw new BadRequestException('There was an ERROR fetching reviews')
        }
    }

    async fetch_review(query:Object): Promise<Review>{
        try {
            return await this.prisma.prismaClient.review.findFirst({where:query})
        } catch (error) {
            throw new BadRequestException('There was an ERROR fething the review')
        }
    }

    async update_review(id: number, data): Promise<Review>{
        try {
            return await this.prisma.prismaClient.review.update({where:{id}, data})
        } catch (error) {
            console.log(error)
            throw new BadRequestException('There was an ERROR updating the review')
        }
    }

    async delete_review(id: number): Promise<Review>{
        try {
            return await this.prisma.prismaClient.review.delete({where:{id}})
        } catch (error) {
            throw new BadRequestException('There was an ERROR deleting the review')
        }
    }
}
