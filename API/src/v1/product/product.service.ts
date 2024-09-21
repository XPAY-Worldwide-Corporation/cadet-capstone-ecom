import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaConfigService } from 'src/config/config.prisma';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaConfigService) {}

  async create(createProductDto: CreateProductDto) {
    const { name, description, quantity, price, image, categoryId } =
      createProductDto;
    return this.prisma.product.create({
      data: {
        name,
        description,
        quantity: Number(quantity),
        price: Number(price),
        image: JSON.stringify(image),
        category: { connect: { id: Number(categoryId) } },
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { name, description, quantity, price, image, categoryId } =
      updateProductDto;
    return this.prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        quantity: Number(quantity),
        price: Number(price),
        image: JSON.stringify(image),
        category: { connect: { id: Number(categoryId) } },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
