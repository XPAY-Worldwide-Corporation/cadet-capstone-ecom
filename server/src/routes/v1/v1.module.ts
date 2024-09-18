import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { RESOURCE } from "src/constants";
import { v1Routes } from "./v1.routes";
import { CustomersModule } from "./customers/customers.module";
import { MerchantsModule } from "./merchants/merchants.module";
import { RolesModule } from "./roles/roles.module";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { ProductsModule } from "./products/products.module";
import { DiscountsModule } from "./discounts/discounts.module";
import { TransactionsModule } from './transactions/transactions.module';
import { CommentsModule } from './comments/comments.module';
import { RefundModule } from './refund/refund.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: RESOURCE.API + RESOURCE.V1,
        module: V1Module,
        children: v1Routes,
      },
    ]),
    RolesModule,
    CustomersModule,
    MerchantsModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    DiscountsModule,
    TransactionsModule,
    CommentsModule,
    RefundModule,
  ],
})
export class V1Module {}
