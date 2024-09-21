import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.authService.login(loginUserDto);
    res.status(200).json(result);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      await this.authService.logout();
      res
        .status(200)
        .json({ message: 'You have been logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error during logout' });
    }
  }
}
