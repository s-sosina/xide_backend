import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { RemittanceService } from '../remittance.service';

@Controller('webhooks/paystack')
export class PaystackWebhookController {
  constructor(private readonly remittanceService: RemittanceService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-paystack-signature') signature: string,
  ) {
    // Webhook handling
    return { received: true };
  }
}
