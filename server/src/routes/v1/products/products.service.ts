import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaConfigService } from "src/config";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaConfigService) {}

  getAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        merchant: true,
      },
    });
  }

  async getById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        merchant: true,
      },
    });

    if (!product) throw new NotFoundException("Product not found");

    return product;
  }

  async add(createProductDto: CreateProductDto) {
    const { categoryId, merchantId, price, image, ...productData } =
      createProductDto;

    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException("Category not found");

    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });
    if (!merchant) throw new NotFoundException("Merchant not found");

    return this.prisma.product.create({
      data: {
        ...productData,
        price: parseFloat(price.toString()),
        image: JSON.stringify(image),
        category: {
          connect: { id: categoryId },
        },
        merchant: {
          connect: { id: merchantId },
        },
      },
      include: {
        category: true,
        merchant: true,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        merchant: true,
      },
    });

    if (!product) throw new NotFoundException("Product not found");

    const { categoryId, merchantId, price, image, ...updateData } =
      updateProductDto;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        price: price ? parseFloat(price.toString()) : product.price,
        image: image ? JSON.stringify(image) : product.image,
        category: {
          connect: { id: categoryId },
        },
        merchant: {
          connect: { id: merchantId },
        },
      },
      include: {
        category: true,
        merchant: true,
      },
    });
  }

  async deleteById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        merchant: true,
      },
    });

    if (!product) throw new NotFoundException("Product not found");

    return this.prisma.product.delete({
      where: { id },
      include: {
        category: true,
        merchant: true,
      },
    });
  }
}
