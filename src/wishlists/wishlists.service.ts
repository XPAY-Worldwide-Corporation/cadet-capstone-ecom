import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async addToWishlist(userId: number, productId: number, item: string): Promise<Wishlist> {
    const wishlist = this.wishlistsRepository.create({
      item,
      user: { id: userId } as User,
      product: { id: productId } as Product,
    });
    return await this.wishlistsRepository.save(wishlist);
  }

  async getWishlist(userId: number): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find({ where: { user: { id: userId } } });
  }

  async removeFromWishlist(userId: number, productId: number): Promise<void> {
    await this.wishlistsRepository.delete({ user: { id: userId }, product: { id: productId } });
  }
}