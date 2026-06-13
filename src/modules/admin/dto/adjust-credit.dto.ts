import { IsNotEmpty, IsNumber } from 'class-validator';

export class AdjustCreditDto {
  @IsNotEmpty()
  @IsNumber()
  creditLimit: number;
}
