import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { InventoryModule } from './inventory/inventory.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  controllers: [StoreController],
  providers: [StoreService],
  imports: [InventoryModule, AnalyticsModule, CategoriesModule],
})
export class StoreModule {}
