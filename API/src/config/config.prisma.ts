import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaConfigService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaConfigService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log(`Database connected at ${process.env.DATABASE_URL}`);
      this.logger.log(`Server running on port ${process.env.PORT}`);
    } catch (error) {
      this.logger.error(`Database connection error: ${error.message}`);
      process.exit(Number(process.env.STATUSCODE_ONE));
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database connection closed');
    } catch (error) {
      this.logger.error(`Error during disconnection: ${error.message}`);
    }
  }
}
