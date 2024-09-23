import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly stripeSecretKey: string = process.env.STRIPE_SECRET_KEY || 'your-stripe-secret-key';

  getStripeSecretKey(): string {
    return this.stripeSecretKey;
  }
}