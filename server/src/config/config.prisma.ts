import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ENV } from "./config.environment";
import { STATUSCODE } from "src/constants";

@Injectable()
export class PrismaConfigService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaConfigService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log(`Database connected at ${ENV.DATABASE_URL}`);
      this.logger.log(`Server running on port ${ENV.PORT}`);
    } catch (error) {
      this.logger.error(`Database connection error: ${error.message}`);
      process.exit(STATUSCODE.ONE);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log("Database connection closed");
    } catch (error) {
      this.logger.error(`Error during disconnection: ${error.message}`);
    }
  }
}
