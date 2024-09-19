/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get()
  getAllVouchers() {
    return this.vouchersService.findAll();
  }

  @Post()
  addNewVoucher(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  @Delete(':id')
  deleteVoucher(@Param('id') id: string) {
    return this.vouchersService.remove(+id);
  }
}
