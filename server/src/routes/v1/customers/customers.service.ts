import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { RolesService } from "../roles/roles.service";
import * as bcrypt from "bcrypt";
import { ENV, PrismaConfigService } from "src/config";

@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaConfigService,
    private readonly rolesService: RolesService,
  ) {}

  async getAll() {
    return this.prisma.customer.findMany({
      include: { role: true },
    });
  }

  async getById(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!customer) throw new NotFoundException("Customer not found");

    return customer;
  }

  async add(createCustomerDto: CreateCustomerDto) {
    const {
      roleId,
      password,
      image,
      government_id,
      verificationCode,
      ...customerData
    } = createCustomerDto;

    const role = await this.rolesService.getById(roleId);
    if (!role) throw new NotFoundException("Role not found");

    return this.prisma.customer.create({
      data: {
        ...customerData,
        password: await bcrypt.hash(password, ENV.SALT_NUMBER),
        image: JSON.stringify(image),
        verificationCode: JSON.stringify(verificationCode),
        government_id: JSON.stringify(government_id),
        role: {
          connect: { id: roleId },
        },
      },
      include: { role: true },
    });
  }

  async edit(id: number, updateCustomerDto: UpdateCustomerDto) {
    const { image, verificationCode, government_id, ...customerData } =
      updateCustomerDto;

    const customer = await this.getById(id);
    if (!customer) throw new NotFoundException("Customer not found");

    return this.prisma.customer.update({
      where: { id },
      data: {
        ...customerData,
        image: JSON.stringify(image),
        verificationCode: JSON.stringify(verificationCode),
      },
      include: { role: true },
    });
  }

  async delete(id: number) {
    const customer = await this.getById(id);

    if (!customer) throw new NotFoundException("Customer not found");

    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
