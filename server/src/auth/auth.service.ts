import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { TokenService } from './jwt/token.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService : PrismaService,
    private bcryptService : BcryptService,
    private tokenService: TokenService
  ) {}
  
  async signUpUser(createAuthDto: CreateAuthDto) {
    const hashedPassword = await this.bcryptService.hashPassword(createAuthDto.password);
    
    const user = await this.prismaService.user.create({
      data : {
        username: createAuthDto.username,
        email: createAuthDto.email,
        password: hashedPassword
      }
    });

    
    return user;
  }

  async signInUser(updateAuthDto: UpdateAuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: updateAuthDto.email
      },
    });

    if(!user) throw new UnauthorizedException();

    const doesPasswordMatch = await this.bcryptService.comparePassword(
      updateAuthDto.password,
      user.password 
    );
    
    if(!doesPasswordMatch) throw new UnauthorizedException();

    let payload;

    if(updateAuthDto.signInAs === 'customer') {
      const customer = await this.prismaService.customer.findUnique({
        where : { userId : user.id }
      });

      payload = {
        username: user.username,
        userId: user.id,
        customerId: customer.id,
        userRole: "customer",
      }
    }

    if(updateAuthDto.signInAs === 'seller') {
      const seller = await this.prismaService.seller.findUnique({
        where : { userId : user.id },
        include: {
          store: {
            select: {
              id: true
            }
          }
        }
      });

      payload = {
        username: user.username,
        userId: user.id,
        sellerId: seller.id,
        storeId: seller.store.id,
        userRole: "seller",
      }
    }

    return await this.tokenService.generateAccessToken(payload);
  }

  resetUserPassword(updateAuthDto : UpdateAuthDto) { }

}
