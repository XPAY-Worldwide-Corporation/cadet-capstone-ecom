import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/config';

@Injectable()
export class TokenService {
   constructor(
      private jwtService : JwtService
   ) { }
   
   private jwtSecret = JWT_SECRET;

   async generateAccessToken(payload : any) {
      return await this.jwtService.signAsync(payload)
   }

   async verifyAccessToken(token : string) {
      return await this.jwtService.verifyAsync(token, { secret: this.jwtSecret });
   }
}
