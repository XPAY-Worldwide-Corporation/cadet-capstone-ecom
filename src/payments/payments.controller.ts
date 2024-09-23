import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number; currency: string }) {
    return this.paymentsService.createPaymentIntent(body.amount, body.currency);
  }
}
