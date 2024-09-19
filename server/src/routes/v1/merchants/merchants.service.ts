import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMerchantDto } from "./dto/create-merchant.dto";
import { UpdateMerchantDto } from "./dto/update-merchant.dto";
import { RolesService } from "../roles/roles.service";
import * as bcrypt from "bcrypt";
import { ENV, PrismaConfigService } from "src/config";

@Injectable()
export class MerchantsService {
  constructor(
    private readonly prisma: PrismaConfigService,
    private readonly rolesService: RolesService,
  ) {}

  async getAll() {
    return this.prisma.merchant.findMany({
      include: { role: true },
    });
  }

  async getById(id: number) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!merchant) throw new NotFoundException("Merchant not found");

    return merchant;
  }

  async add(createMerchantDto: CreateMerchantDto) {
    const { roleId, password, image, verificationCode, ...merchantData } =
      createMerchantDto;

    const role = await this.rolesService.getById(roleId);
    if (!role) throw new NotFoundException("Role not found");

    return this.prisma.merchant.create({
      data: {
        ...merchantData,
        password: await bcrypt.hash(password, ENV.SALT_NUMBER),
        image: JSON.stringify(image),
        verificationCode: JSON.stringify(verificationCode),
        role: {
          connect: { id: roleId },
        },
      },
      include: { role: true },
    });
  }

  async edit(id: number, updateMerchantDto: UpdateMerchantDto) {
    const { image, verificationCode, ...merchantData } = updateMerchantDto;

    const merchant = await this.getById(id);
    if (!merchant) throw new NotFoundException("Merchant not found");

    return this.prisma.merchant.update({
      where: { id },
      data: {
        ...merchantData,
        image: JSON.stringify(image),
        verificationCode: JSON.stringify(verificationCode),
      },
      include: { role: true },
    });
  }

  async delete(id: number) {
    const merchant = await this.getById(id);

    if (!merchant) throw new NotFoundException("Merchant not found");

    return this.prisma.merchant.delete({
      where: { id },
    });
  }
}
