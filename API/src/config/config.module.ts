import { Module, Global } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { storage } from './config.cloudinary';
import { PrismaConfigService } from './config.prisma';

@Global()
@Module({
  providers: [PrismaConfigService],
  imports: [
    MulterModule.register({
      storage,
    }),
  ],
  exports: [PrismaConfigService],
})
export class ConfigsModule {}
