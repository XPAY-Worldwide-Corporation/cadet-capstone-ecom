import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaConfigService } from "src/config";
import * as bcrypt from "bcrypt";
import { LoginUserDto } from "./dto/login.dto";
import { TokenService } from "src/middleware/middleware.verifyToken";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaConfigService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user =
      (await this.prisma.customer.findUnique({
        where: { email },
        include: { role: true },
      })) ??
      (await this.prisma.merchant.findUnique({
        where: { email },
        include: { role: true },
      }));

    if (!user) throw new NotFoundException("No user found with this email");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException("Invalid credentials");

    const accessToken = this.jwtService.sign({
      id: user.id,
      role: user.role.roleName,
    });

    this.tokenService.setToken(accessToken);

    return { accessToken, user };
  }

  async logoutUser() {
    const token = this.tokenService.getToken();

    if (!token || this.tokenService.isTokenBlacklisted())
      throw new UnauthorizedException("You are not logged in");

    this.tokenService.blacklistToken();
  }
}
