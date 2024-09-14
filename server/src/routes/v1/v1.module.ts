import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { RESOURCE } from "src/constants";
import { v1Routes } from "./v1.routes";
import { CustomersModule } from "./customers/customers.module";
import { MerchantsModule } from "./merchants/merchants.module";
import { RolesModule } from "./roles/roles.module";
import { AuthModule } from "./auth/auth.module";

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
  ],
})
export class V1Module {}
