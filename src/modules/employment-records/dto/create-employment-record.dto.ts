import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import { EmploymentStatus } from '../enums/employment-status.enum';

export class CreateEmploymentRecordDto {
  @IsNotEmpty()
  @IsString()
  employerId: string;

  @IsNotEmpty()
  @IsString()
  workerId: string;

  @IsNotEmpty()
  @IsString()
  employeeNumber: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @IsNotEmpty()
  @IsNumber()
  monthlySalary: number;

  @IsNotEmpty()
  @IsString()
  salaryBand: string;

  @IsOptional()
  @IsEnum(EmploymentStatus)
  status?: EmploymentStatus;
}
