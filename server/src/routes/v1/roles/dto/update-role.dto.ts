import { PartialType } from "@nestjs/mapped-types";
import { CreateRoleDto } from "./create-role.dto";
import { IsString, IsNotEmpty } from "class-validator";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsString()
  @IsNotEmpty()
  roleName: string;
}
