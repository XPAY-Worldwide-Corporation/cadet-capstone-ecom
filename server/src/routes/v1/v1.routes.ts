import { RouteTree } from "@nestjs/core";
import { RESOURCE } from "src/constants";
import {
  RolesModule,
  MerchantsModule,
  CustomersModule,
  AuthModule,
  CategoriesModule,
  ProductsModule,
  DiscountsModule,
  TransactionsModule,
  CommentsModule,
  RefundModule,
} from "../v1";

export const v1Routes: RouteTree[] = [
  {
    path: RESOURCE.ROLES,
    module: RolesModule,
  },
  {
    path: RESOURCE.MERCHANTS,
    module: MerchantsModule,
  },
  {
    path: RESOURCE.CUSTOMERS,
    module: CustomersModule,
  },
  {
    path: RESOURCE.AUTH,
    module: AuthModule,
  },
  {
    path: RESOURCE.AUTH,
    module: AuthModule,
  },
  {
    path: RESOURCE.CATEGORIES,
    module: CategoriesModule,
  },
  {
    path: RESOURCE.PRODUCTS,
    module: ProductsModule,
  },
  {
    path: RESOURCE.DISCOUNTS,
    module: DiscountsModule,
  },
  {
    path: RESOURCE.TRANSACTIONS,
    module: TransactionsModule,
  },
  {
    path: RESOURCE.COMMENTS,
    module: CommentsModule,
  },
  {
    path: RESOURCE.REFUNDS,
    module: RefundModule,
  },
];
