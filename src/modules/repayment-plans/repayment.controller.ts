import { Controller } from '@nestjs/common';
import { RepaymentService } from './repayment.service';

@Controller('repayments')
export class RepaymentController {
  constructor(private readonly repaymentService: RepaymentService) {}
}
