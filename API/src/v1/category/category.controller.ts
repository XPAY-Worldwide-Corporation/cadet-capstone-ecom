
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpStatus,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { responseHandler } from 'src/utils/utils.responseHandler';
import { JwtAuthGuard } from '../auth/auth.guard';
import { roles } from '../auth/roles.decorator';

@Controller('category')
@UseGuards(JwtAuthGuard) // Apply JwtAuthGuard and RolesGuard in this controller
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @roles('Merchant') // Only users with these roles can access this route
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = await this.categoryService.create({
      ...createCategoryDto,
    });
    return responseHandler(
      data,
      'Category created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get()
  @roles('Merchant', 'Customer') // Adjust roles as needed
  async findAll() {
    const data = await this.categoryService.findAll();
    return responseHandler(
      data,
      data?.length === 0
        ? 'No Categories found'
        : 'All Categories retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  @roles('Merchant', 'Customer') // Adjust roles as needed
  async findOne(@Param('id') id: string) {
    const data = await this.categoryService.findOne(+id);
    if (!data) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return responseHandler(
      data,
      'Category retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Patch('edit/:id')
  @roles('Merchant')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const data = await this.categoryService.update(+id, updateCategoryDto);
    if (!data) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return responseHandler(
      data,
      'Category updated successfully',
      HttpStatus.OK,
    );
  }

  @Delete('delete/:id')
  @roles('Merchant')
  async remove(@Param('id') id: string) {
    const data = await this.categoryService.remove(+id);
    if (!data) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return responseHandler(
      data,
      'Category deleted successfully',
      HttpStatus.OK,
    );
  }
}
