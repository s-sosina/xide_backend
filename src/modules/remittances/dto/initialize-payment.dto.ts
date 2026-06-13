import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class InitializePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsArray()
  deductionRecordIds: string[];
}
