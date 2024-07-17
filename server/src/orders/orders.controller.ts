import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/createorder-dto';
import { AuthenticationGuard } from '../auth/guard/authentication-guard'
import { UpdateOrderDto } from './dto/updateorder-dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService:OrdersService){}

    @Get('/calculate_total/:id')
    async calculate_total(@Param('id') id: number){
        return await this.ordersService.fetch_total(id)
    }

    @Post()
    @UseGuards(AuthenticationGuard)
    async create_order(@Body() data:CreateOrderDto, @Request() req){
        data.user_id = req.user.id
        data.status = 'PENDING'
        data.message = data.message || ''
        data.total = await this.ordersService.fetch_total(data.cart_id)
        return await this.ordersService.create_order(data)
    }

    @Get()
    @UseGuards(AuthenticationGuard)
    async fetch_orders(@Request() req){
        return await this.ordersService.fetch_orders({user_id: req.user.id})
    }

    @Get(':id')
    @UseGuards(AuthenticationGuard)
    async fetch_order(@Param('id') id: number){
        return await this.ordersService.fetch_order({id})
    }

    @Patch(':id')
    @UseGuards(AuthenticationGuard)
    async update_order(@Param('id') id: number, @Body() data: UpdateOrderDto){
        return await this.ordersService.update_order(id, data)
    }

    @Delete(':id')
    @UseGuards(AuthenticationGuard)
    async delete_order(@Param('id') id: number){
        return await this.ordersService.delete_order(id)
    }
}
