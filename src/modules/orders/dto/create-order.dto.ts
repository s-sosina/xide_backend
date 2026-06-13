import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RepaymentCycle } from '../../../common/enums/repayment-cycle.enum';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsEnum(RepaymentCycle)
  repaymentCycle: RepaymentCycle;

  @IsNotEmpty()
  @IsString()
  deliveryAddress: string;
}
