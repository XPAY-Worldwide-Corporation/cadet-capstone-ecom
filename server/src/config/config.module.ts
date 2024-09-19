import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { ENV, PrismaConfigService, storage } from "src/config";

@Global()
@Module({
  providers: [PrismaConfigService],
  imports: [
    ConfigModule.forRoot({
      load: [() => ENV],
    }),
    MulterModule.register({
      storage,
    }),
  ],
  exports: [PrismaConfigService],
})
export class AppConfigModule {}
