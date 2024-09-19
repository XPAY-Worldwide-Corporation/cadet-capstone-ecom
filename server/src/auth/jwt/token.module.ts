import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/config';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: JWT_SECRET,
    signOptions: { expiresIn: '3d' },
  })],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
