import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { ProfileModule } from './profile/profile.module';

@Module({
  controllers: [SellerController],
  providers: [SellerService],
  imports: [ProfileModule],
})
export class SellerModule {}
