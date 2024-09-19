import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { DiscountModule } from './discount/discount.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CategoryModule,
    ProductModule,
    UserModule,
    DiscountModule,
    TransactionModule,
    ReviewModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class V1Module {}
