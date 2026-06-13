import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class RecordDeductionDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDate()
  actualDeductionDate: Date;
}
