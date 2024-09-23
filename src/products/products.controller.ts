import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product, Prisma } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(): Promise<Product[]> {
    return this.productsService.getProducts();
  }

  @Get(':id')
async getProductById(@Param('id') id: string): Promise<Product | null> {
  const productId = parseInt(id, 10);
  return this.productsService.getProductById(productId);
}

  @Post()
  async createProduct(@Body() data: Prisma.ProductCreateInput): Promise<Product> {
    return this.productsService.createProduct(data);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: number, @Body() data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.productsService.updateProduct(id, data);
  }

  @Delete(':id')
async deleteProduct(@Param('id') id: string): Promise<Product> {
  const productId = parseInt(id, 10);
  return this.productsService.deleteProduct(productId);
}
}