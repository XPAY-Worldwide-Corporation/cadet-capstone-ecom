import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaConfigService } from "src/config";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaConfigService) {}

  getAll() {
    return this.prisma.role.findMany();
  }

  async getById(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) throw new NotFoundException("Role not found");

    return role;
  }

  async add(createRoleDto: CreateRoleDto) {
    return this.prisma.role.create({
      data: createRoleDto,
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) throw new NotFoundException("Role not found");

    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async deleteById(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException("Role not found");
    return this.prisma.role.delete({
      where: { id },
    });
  }
}
