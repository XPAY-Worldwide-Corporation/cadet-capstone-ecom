import { RouteTree } from "@nestjs/core";
import { RESOURCE } from "src/constants";
import {
  RolesModule,
  MerchantsModule,
  CustomersModule,
  AuthModule,
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
];
