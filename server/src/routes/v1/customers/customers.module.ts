import { Module } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CustomersController } from "./customers.controller";
import { RolesModule } from "../roles/roles.module";

@Module({
  imports: [RolesModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
