import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmployerRegisterDto } from '../employers/dto/register-employer.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('employer/register')
  @Public() // Skip global JWT guards if configured
  @HttpCode(HttpStatus.CREATED)
  registerEmployer(@Body() dto: EmployerRegisterDto): Promise<AuthResponseDto> {
    return this.authService.registerEmployer(dto);
  }
}
