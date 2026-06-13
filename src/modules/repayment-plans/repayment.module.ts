import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepaymentPlan } from './entities/repayment-plan.entity';
import { RepaymentService } from './repayment.service';
import { RepaymentController } from './repayment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RepaymentPlan])],
  providers: [RepaymentService],
  controllers: [RepaymentController],
  exports: [RepaymentService],
})
export class RepaymentPlansModule {}
