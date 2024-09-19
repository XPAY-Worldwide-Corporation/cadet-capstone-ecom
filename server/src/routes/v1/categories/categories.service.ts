import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaConfigService } from "src/config";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaConfigService) {}

  getAll() {
    return this.prisma.category.findMany({
      include: {
        Product: true,
      },
    });
  }

  async getById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        Product: true,
      },
    });

    if (!category) throw new NotFoundException("Category not found");

    return category;
  }

  async add(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) throw new NotFoundException("Category not found");

    return this.prisma.category.update({
      where: { id },
      data: {
        ...updateCategoryDto,
      },
    });
  }

  async deleteById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        Product: true,
      },
    });

    if (!category) throw new NotFoundException("Category not found");

    return this.prisma.category.delete({
      where: { id },
      include: {
        Product: true,
      },
    });
  }
}
