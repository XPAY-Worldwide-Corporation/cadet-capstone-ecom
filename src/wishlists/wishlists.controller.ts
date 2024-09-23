import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async addToWishlist(@Body() body: { userId: number; productId: number; item: string }) {
    return this.wishlistsService.addToWishlist(body.userId, body.productId, body.item);
  }

  @Get(':userId')
  async getWishlist(@Param('userId') userId: number) {
    return this.wishlistsService.getWishlist(userId);
  }

  @Delete()
  async removeFromWishlist(@Body() body: { userId: number; productId: number }) {
    return this.wishlistsService.removeFromWishlist(body.userId, body.productId);
  }
}