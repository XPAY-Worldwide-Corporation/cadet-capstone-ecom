import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CartproductsService } from './cartproducts.service';
import { CreateCartProductDto } from './dto/createcartproduct-dto';
import { FetchCartProductDto } from './dto/fetchcartproducts-dto';
import { UpdateCartProductDto } from './dto/updatecartproducts-dto';
import { AuthenticationGuard } from '../auth/guard/authentication-guard'

@Controller('cartproducts')
export class CartproductsController {
    constructor(private readonly cartproductsService:CartproductsService){}

    @Post()
    @UseGuards(AuthenticationGuard)
    async create_cartproduct(@Body() data:CreateCartProductDto){
        return await this.cartproductsService.create_cartproduct(data)
    }

    @Get('/cart/:id')
    @UseGuards(AuthenticationGuard)
    async fetch_cartproducts(@Param('id') id: number){
        return await this.cartproductsService.fetch_cartproducts({cart_id: id})
    }

    @Get(':id')
    @UseGuards(AuthenticationGuard)
    async fetch_cartproduct(@Param('id') id :number){
        return await this.cartproductsService.fetch_cartproduct({id})
    }

    @Patch(':id')
    @UseGuards(AuthenticationGuard)
    async update_cartproduct(@Param('id') id: number, @Body() data:UpdateCartProductDto){
        return await this.cartproductsService.update_cartproduct(id, data)
    }

    @Delete(':id')
    @UseGuards(AuthenticationGuard)
    async delete_cartproduct(@Param('id') id: number){
        return await this.cartproductsService.delete_cartproduct(id)
    }
}
