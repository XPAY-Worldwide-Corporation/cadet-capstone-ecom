import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts(
    @Query('store') storeId: number,
    @Query('category') catId: number,
    @Query('store_category') storeCatId: number
  ) {
    return [storeId, catId, storeCatId];
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return id;
  }

  @Post()
  addNewProduct(@Body() createProductDto: CreateProductDto) {
  }

  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
  }
}
