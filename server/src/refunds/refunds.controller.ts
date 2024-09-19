import { Controller, Get, Post, Body, Patch, Param,Query } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { UpdateRefundDto } from './dto/update-refund.dto';

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Get()
  getAllRefunds(@Query('status') statusId : string) {
    return statusId;
  }
  
  @Get(':refund_id')
  getRefundById(@Param('refund_id') id: string) {
  }

  @Post()
  addRefund(@Body() createRefundDto: CreateRefundDto) {
  }

  @Patch(':refund_id')
  updateRefundStatus(
    @Param('refund_id') id: string, 
    @Body() updateRefundDto: UpdateRefundDto
  ) {
  }

}
