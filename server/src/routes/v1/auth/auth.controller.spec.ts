import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login.dto";
import { UnauthorizedException, NotFoundException } from "@nestjs/common";
import { responseHandler } from "src/utils";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "src/middleware/middleware.verifyToken";

describe("AuthController & AuthService", () => {
  let controller: AuthController;
  let service: AuthService;

  const mockJwtService = { sign: jest.fn(), verify: jest.fn() };
  const mockTokenService = {
    setToken: jest.fn(),
    getToken: jest.fn(),
    isTokenBlacklisted: jest.fn(),
    blacklistToken: jest.fn(),
  };

  const mockAuthService = {
    validateUser: jest.fn(),
    logoutUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe("loginUser", () => {
    it("should return user and access token on successful login", async () => {
      const loginDto: LoginUserDto = {
        email: "test@example.com",
        password: "password",
      };

      const mockResponse = {
        accessToken: "token",
        user: { id: 1, email: "test@example.com" },
      };

      mockAuthService.validateUser.mockResolvedValue(mockResponse);

      const result = await controller.loginUser(loginDto);

      expect(result).toMatchSnapshot();
    });

    it("should throw NotFoundException if user is not found", async () => {
      const loginDto: LoginUserDto = {
        email: "test@example.com",
        password: "password",
      };

      mockAuthService.validateUser.mockRejectedValue(
        new NotFoundException("No user found with this email"),
      );

      await expect(controller.loginUser(loginDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw UnauthorizedException if credentials are invalid", async () => {
      const loginDto: LoginUserDto = {
        email: "test@example.com",
        password: "password",
      };

      mockAuthService.validateUser.mockRejectedValue(
        new UnauthorizedException("Invalid credentials"),
      );

      await expect(controller.loginUser(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe("logoutUser", () => {
    it("should return success message on successful logout", async () => {
      mockAuthService.logoutUser.mockResolvedValue(undefined);

      const result = await controller.logoutUser();

      expect(result).toMatchSnapshot();
    });

    it("should throw UnauthorizedException if no user is logged in", async () => {
      mockAuthService.logoutUser.mockRejectedValue(
        new UnauthorizedException("You are not logged in"),
      );

      await expect(controller.logoutUser()).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
