import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.getUserByEmail(loginDto.email);
    if (user && user.Password === loginDto.password) {
      const payload = { email: user.Email, sub: user.UserID };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new Error('Invalid credentials');
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.createUser({
      Email: registerDto.email,
      Password: registerDto.password,
      Name: registerDto.name,
    } as Prisma.UserCreateInput);
    const payload = { email: user.Email, sub: user.UserID };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}