import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UploadedFiles,
  UseInterceptors,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { responseHandler } from 'src/utils/utils.responseHandler';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multipleImages } from 'src/utils/utils.cloudinary';
import { JwtAuthGuard } from '../auth/auth.guard';
import { roles } from '../auth/roles.decorator';

@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @roles('Merchant',)
  @UseInterceptors(FilesInterceptor('image', 10)) // Handle up to 10 image files
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = await multipleImages(files, []);

    if (uploadedImages.length === 0)
      throw new BadRequestException('At least one image is required.');

    const data = await this.productService.create({
      ...createProductDto,
      image: uploadedImages,
    });

    return responseHandler(
      data,
      'Product created successfully',
      HttpStatus.CREATED,
    );
  }
  @Get()
  @roles('Merchant', 'Customer')
  async findAll() {
    const data = await this.productService.findAll();
    return responseHandler(
      data,
      data?.length === 0
        ? 'No Product found'
        : 'All Product retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  @roles('Merchant', 'Customer')
  async findOne(@Param('id') id: string) {
    const data = await this.productService.findOne(+id);
    if (!data) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return responseHandler(
      data,
      'Product retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Patch('edit/:id')
  @roles('Merchant',)
  @UseInterceptors(FilesInterceptor('image', 10)) // Handle up to 10 image files
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const uploadedImages = await multipleImages(files, []);

    if (uploadedImages.length > 0) {
      updateProductDto.image = uploadedImages;
    }

    const data = await this.productService.update(+id, updateProductDto);

    if (!data) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return responseHandler(data, 'Product updated successfully', HttpStatus.OK);
  }

  @Delete('delete/:id')
  @roles('Merchant',)
  async remove(@Param('id') id: string) {
    const data = await this.productService.remove(+id);
    if (!data) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return responseHandler(data, 'Product deleted successfully', HttpStatus.OK);
  }
}
