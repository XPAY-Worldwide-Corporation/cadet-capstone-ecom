import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ConfigService } from '../config/config.service';

@Module({
  providers: [PaymentsService, ConfigService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}