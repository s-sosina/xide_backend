import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCreditDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
