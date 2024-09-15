import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // include the cart items
  @Get()
  getCustomerCart() {
    return this.cartsService.findAll();
  }

  @Get(':cart_id/items/:item_id')
  getItemFromCart(
    @Param('cart_id') cartId: string,
    @Param('item_id') itemId: string,
  ) {}

  @Post(':cart_id')
  addItemToCart(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Patch(':cart_id/items/:item_id')
  updateItemFromCart(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartsService.update(+id, updateCartDto);
  }

  @Delete(':cart_id/items/:item_id')
  deleteItemFromCart(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }
}
