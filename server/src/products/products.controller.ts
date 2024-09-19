import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAllProducts(
    @Query('store') storeId: number,
    @Query('category') catId: number,
    @Query('store_category') storeCatId: number
  ) {
    return await this.productsService.findAllProducts(storeId, catId, storeCatId);
  }

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id : number) {
     return await this.productsService.findProductById(id);
  }

  @Post()
  async addNewProduct(@Body(ValidationPipe) createProductDto: CreateProductDto) {
    return await this.productsService.createNewProduct(createProductDto);
    
  }

  @Patch(':id')
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) updateProductDto: UpdateProductDto) {
    return await this.productsService.updateAProduct(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.deleteAProduct(id);
  }
}
