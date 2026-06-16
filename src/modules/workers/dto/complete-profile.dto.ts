import { IsNotEmpty, IsString } from 'class-validator';

export class CompleteProfileDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
