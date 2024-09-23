import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client'

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async getProductById(productId: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: {
        ProductID: productId,
      },
    });
  }

  async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data: {
        Name: "Test Product",
        Price: 100,
        Description: "Product Description",
        StockLevel: 50,
        Category: {
          create: {
            CategoryName: "Default Category", 
            Description: "Default category description", 
          },
        },
      },
    });
  }

  async updateProduct(productId: number, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({
      where: { ProductID: productId },
      data,
    });
  }

  async deleteProduct(productId: number): Promise<Product> {
    return this.prisma.product.delete({
      where: {
        ProductID: productId,
      },
    });
  }
}