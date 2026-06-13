import { Controller } from '@nestjs/common';
import { RemittanceService } from './remittance.service';

@Controller('remittances')
export class RemittanceController {
  constructor(private readonly remittanceService: RemittanceService) {}
}
