import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service'

@Module({
  providers: [UsersService, PrismaService]
})
export class UsersModule {}
