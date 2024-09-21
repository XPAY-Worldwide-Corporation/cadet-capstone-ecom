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
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { responseHandler } from 'src/utils/utils.responseHandler';
import { JwtAuthGuard } from '../auth/auth.guard';
import { roles } from '../auth/roles.decorator';

@Controller('discount')
@UseGuards(JwtAuthGuard)
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @roles('Merchant')
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    const data = await this.discountService.create(createDiscountDto);
    return responseHandler(
      data,
      'Discount created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get()
  @roles('Merchant', 'Customer')
  async findAll() {
    const data = await this.discountService.findAll();
    return responseHandler(
      data,
      data?.length === 0
        ? 'No discounts found'
        : 'All discounts retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  @roles('Merchant', 'Customer')
  async findOne(@Param('id') id: string) {
    const data = await this.discountService.findOne(+id);
    if (!data) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }
    return responseHandler(
      data,
      'Discount retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Patch('edit/:id')
  @roles('Merchant')
  async update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    const data = await this.discountService.update(+id, updateDiscountDto);
    if (!data) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }
    return responseHandler(
      data,
      'Discount updated successfully',
      HttpStatus.OK,
    );
  }

  @Delete('delete/:id')
  @roles('Merchant')
  async remove(@Param('id') id: string) {
    const data = await this.discountService.remove(+id);
    if (!data) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }
    return responseHandler(
      data,
      'Discount deleted successfully',
      HttpStatus.OK,
    );
  }
}
