import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';
import { TokenModule } from './jwt/token.module';

@Module({
  imports: [PrismaModule, BcryptModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
