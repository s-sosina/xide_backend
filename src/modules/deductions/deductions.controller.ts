import { Controller } from '@nestjs/common';
import { DeductionsService } from './deductions.service';

@Controller('deductions')
export class DeductionsController {
  constructor(private readonly deductionsService: DeductionsService) {}
}
