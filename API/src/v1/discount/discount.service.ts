import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { PrismaConfigService } from 'src/config/config.prisma';

@Injectable()
export class DiscountService {
  constructor(private readonly prisma: PrismaConfigService) {}

  async create(createDiscountDto: CreateDiscountDto) {
    const { start_date, end_date } = createDiscountDto;

    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestException('Start date must be before the end date');
    }

    return await this.prisma.discount.create({
      data: {
        ...createDiscountDto,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
      },
    });
  }

  async findAll() {
    return this.prisma.discount.findMany();
  }

  async findOne(id: number) {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
    });

    if (!discount) {
      throw new NotFoundException('Discount not found');
    }

    return discount;
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
    });

    if (!discount) {
      throw new NotFoundException('Discount not found');
    }

    if (updateDiscountDto.start_date && updateDiscountDto.end_date) {
      if (
        new Date(updateDiscountDto.start_date) >
        new Date(updateDiscountDto.end_date)
      ) {
        throw new BadRequestException('Start date must be before the end date');
      }
    }

    return this.prisma.discount.update({
      where: { id },
      data: {
        ...updateDiscountDto,
        start_date: updateDiscountDto.start_date
          ? new Date(updateDiscountDto.start_date)
          : undefined,
        end_date: updateDiscountDto.end_date
          ? new Date(updateDiscountDto.end_date)
          : undefined,
      },
    });
  }

  async remove(id: number) {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
    });

    if (!discount) {
      throw new NotFoundException('Discount not found');
    }

    return this.prisma.discount.delete({
      where: { id },
    });
  }
}
