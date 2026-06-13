import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWorkerDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  employerId: string;

  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @IsNotEmpty()
  @IsString()
  employeeId: string;
}
