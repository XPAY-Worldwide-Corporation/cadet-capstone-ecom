import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login.dto";
import { responseHandler } from "src/utils";
import { PATH } from "src/constants";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(PATH.LOGIN)
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const { accessToken, user } =
      await this.authService.validateUser(loginUserDto);

    return responseHandler(user, "User Login successfully", {
      accessToken,
    });
  }

  @Post(PATH.LOGOUT)
  async logoutUser() {
    await this.authService.logoutUser();

    return responseHandler([], "User Logout successfully");
  }
}
