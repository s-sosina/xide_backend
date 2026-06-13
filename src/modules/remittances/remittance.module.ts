import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemittanceTransaction } from './entities/remittance-transaction.entity';
import { RemittanceService } from './remittance.service';
import { RemittanceController } from './remittance.controller';
import { PaystackWebhookController } from './webhooks/paystack.webhook';

@Module({
  imports: [TypeOrmModule.forFeature([RemittanceTransaction])],
  providers: [RemittanceService],
  controllers: [RemittanceController, PaystackWebhookController],
  exports: [RemittanceService],
})
export class RemittancesModule {}
