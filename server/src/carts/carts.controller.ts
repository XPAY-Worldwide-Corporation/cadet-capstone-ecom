import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/createcart-dto';
import { AuthenticationGuard } from '../auth/guard/authentication-guard'
import { UpdateCartDto } from './dto/updatecart-dto';

@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService:CartsService){}

    @Post()
    @UseGuards(AuthenticationGuard)
    async create_cart(@Body() data:CreateCartDto, @Request() req){
        data.user_id = req.user.id
        return await this.cartsService.create_cart(data)
    }

    @Get()
    @UseGuards(AuthenticationGuard)
    async fetch_carts(@Request() req){
        return await this.cartsService.fetch_carts({user_id:req.user.id})
    }

    @Get(':id')
    @UseGuards(AuthenticationGuard)
    async fetch_cart(@Param('id') id: number){
        return await this.cartsService.fetch_cart(id)
    }

    @Patch(':id')
    @UseGuards(AuthenticationGuard)
    async update_cart(@Param('id') id: number, @Body() data:UpdateCartDto){
        delete data.id
        return await this.cartsService.update_cart(id, data)
    }

    @Delete(':id')
    @UseGuards(AuthenticationGuard)
    async delete_cart(@Param('id') id: number){
        return await this.cartsService.delete_cart(id)
    }
}
