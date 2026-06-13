import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepaymentPlan } from './entities/repayment-plan.entity';

@Injectable()
export class RepaymentService {
  constructor(
    @InjectRepository(RepaymentPlan)
    private readonly repaymentPlanRepository: Repository<RepaymentPlan>,
  ) {}
}
