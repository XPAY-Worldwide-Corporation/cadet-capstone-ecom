import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaConfigService } from 'src/config/config.prisma';
import { LoginUserDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly blacklistedTokens: Set<string> = new Set();
  private currentToken: string | null = null; // Store the current token

  constructor(
    private readonly prisma: PrismaConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role_name: user.role_name,
    };
    const accessToken = this.jwtService.sign(payload);

    // Save the token for the session
    this.currentToken = accessToken;

    return {
      access_token: accessToken,
    };
  }

  async logout(): Promise<void> {
    if (!this.currentToken) {
      throw new UnauthorizedException('No token to logout');
    }

    // Verify if the token is valid before adding to the blacklist
    if (await this.verifyToken(this.currentToken)) {
      this.blacklistedTokens.add(this.currentToken);
      this.currentToken = null; // Clear the current token after logout
    } else {
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.blacklistedTokens.has(token);
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token); // Verify if the token is valid
      // Check if the token is blacklisted
      return !this.blacklistedTokens.has(token);
    } catch {
      return false; // Token is invalid or expired
    }
  }
}
