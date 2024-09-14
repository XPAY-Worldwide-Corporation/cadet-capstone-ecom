import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { responseHandler } from "src/utils";
import { STATUSCODE, PATH, RESOURCE } from "src/constants";

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll() {
    const data = await this.rolesService.getAll();
    return responseHandler(
      data,
      data.length === STATUSCODE.ZERO
        ? "No roles found"
        : "All roles retrieved successfully",
    );
  }

  @Get(PATH.ID)
  async findOne(@Param(RESOURCE.ID) id: number) {
    const data = await this.rolesService.getById(id);
    return responseHandler(data, "Role retrieved successfully");
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const data = await this.rolesService.add(createRoleDto);
    return responseHandler(data, "Role created successfully");
  }

  @Patch(PATH.EDIT)
  async update(
    @Param(RESOURCE.ID) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const data = await this.rolesService.update(id, updateRoleDto);
    return responseHandler(data, "Role updated successfully");
  }

  @Delete(PATH.DELETE)
  async remove(@Param(RESOURCE.ID) id: number) {
    const data = await this.rolesService.deleteById(id);
    return responseHandler(data, "Role deleted successfully");
  }
}
