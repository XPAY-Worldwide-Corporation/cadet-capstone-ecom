import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { roles } from '../auth/roles.decorator';

@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @roles( 'Customer')
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Patch(':id/complete')
  @roles('Merchant', 'Customer')
  completeTransaction(@Param('id') id: string) {
    return this.transactionService.completeTransaction(+id);
  }

  @Get()
  @roles('Merchant',)
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  @roles('Merchant', 'Customer')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }
}
