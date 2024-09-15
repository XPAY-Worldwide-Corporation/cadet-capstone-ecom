import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaConfigService } from "src/config";
import { CreateInventoryDto } from "./dto/create-inventory.dto";
import { UpdateInventoryDto } from "./dto/update-inventory.dto";

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaConfigService) {}

  getAll() {
    return this.prisma.inventory.findMany({
      include: {
        product: true,
      },
    });
  }

  async getById(id: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!inventory) throw new NotFoundException("Inventory not found");

    return inventory;
  }

  async add(createInventoryDto: CreateInventoryDto) {
    return this.prisma.inventory.create({
      data: {
        stock: Number(createInventoryDto.stock),
        product: {
          connect: { id: createInventoryDto.productId },
        },
      },
      include: {
        product: true,
      },
    });
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!inventory) throw new NotFoundException("Inventory not found");

    return this.prisma.inventory.update({
      where: { id },
      data: {
        stock: Number(updateInventoryDto.stock),
        product: {
          connect: { id: updateInventoryDto.productId },
        },
      },
      include: {
        product: true,
      },
    });
  }

  async deleteById(id: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!inventory) throw new NotFoundException("Inventory not found");

    return this.prisma.inventory.delete({
      where: { id },
      include: {
        product: true,
      },
    });
  }
}
