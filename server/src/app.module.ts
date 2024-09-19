import { Module } from '@nestjs/common';
import { CartsModule } from './carts/carts.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { RatingsReviewsModule } from './ratings-reviews/ratings-reviews.module';
import { RefundsModule } from './refunds/refunds.module';
import { CategoriesModule } from './categories/categories.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { CustomerModule } from './customer/customer.module';
import { SellerModule } from './seller/seller.module';
import { StoreModule } from './store/store.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrdersModule } from './orders/orders.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    CartsModule, 
    BookmarksModule, 
    AuthModule, 
    ProductsModule, 
    RatingsReviewsModule, 
    RefundsModule, 
    CategoriesModule, 
    VouchersModule, 
    CustomerModule, 
    SellerModule, 
    StoreModule, 
    BcryptModule, 
    PrismaModule, OrdersModule
  ],
})

export class AppModule {}
