import { Module } from '@nestjs/common';
import { ConfigsModule } from './config/config.module';
import { V1Module } from './v1/v1.module';

@Module({
  imports: [ConfigsModule, V1Module],
  controllers: [],
  providers: [],
})
export class AppModule {}
