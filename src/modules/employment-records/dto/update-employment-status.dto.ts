import { IsEnum, IsNotEmpty } from 'class-validator';
import { EmploymentStatus } from '../enums/employment-status.enum';

export class UpdateEmploymentStatusDto {
  @IsNotEmpty()
  @IsEnum(EmploymentStatus)
  status: EmploymentStatus;
}
