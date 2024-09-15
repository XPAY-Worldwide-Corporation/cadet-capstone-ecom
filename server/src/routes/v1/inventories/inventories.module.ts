import { Module } from "@nestjs/common";
import { InventoryService } from "./inventories.service";
import { InventoryController } from "./inventories.controller";

@Module({
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoriesModule {}
