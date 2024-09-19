import { Controller, Get, Post, Body, Patch, ValidationPipe, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from "express";
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUpUser(@Body(ValidationPipe) createAuthDto: CreateAuthDto) {
    const accessToken = await this.authService.signUpUser(createAuthDto); 
  }

  @Post('/signin')
  async signInUser(@Body(ValidationPipe) createAuthDto: UpdateAuthDto, @Res() res : Response) {
    const accessToken = await this.authService.signInUser(createAuthDto);

    return res.cookie('access_token', accessToken, {
      httpOnly: true
    }).send();
  }

  @Get('/signout')
  signOutUser(@Res() res : Response) {
    res.clearCookie('access_token').send();
  }

  @Patch('/reset-password')
  async resetUserPassword(@Body() updateAuthDto: UpdateAuthDto) { }
}
