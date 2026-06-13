import { IsEnum, IsNotEmpty } from 'class-validator';
import { RepaymentCycle } from '../../../common/enums/repayment-cycle.enum';

export class SelectCycleDto {
  @IsNotEmpty()
  @IsEnum(RepaymentCycle)
  repaymentCycle: RepaymentCycle;
}
