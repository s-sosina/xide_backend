import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class EmployerRegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  organizationName: string;

  @IsEmail()
  payrollEmail: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  companySize: string;

  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsBoolean()
  acceptedTerms: boolean;
}
