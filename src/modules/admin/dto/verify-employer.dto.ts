import { IsBoolean, IsNotEmpty } from 'class-validator';

export class VerifyEmployerDto {
  @IsNotEmpty()
  @IsBoolean()
  isVerified: boolean;
}
