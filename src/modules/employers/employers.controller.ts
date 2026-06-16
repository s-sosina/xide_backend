import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';

import { EmployersService, CsvWorkerRow } from './employers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserRolesGuard } from '../../common/guards/user-roles.guard';
import { UserRoles } from '../../common/decorators/user-roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('employers')
@UseGuards(JwtAuthGuard, UserRolesGuard)
export class EmployersController {
  constructor(private readonly employersService: EmployersService) {}

  @Post('workers/upload')
  @UserRoles(UserRole.EMPLOYER)
  @HttpCode(HttpStatus.OK)
  async uploadWorkers(@GetUser() user: any, @Body() body: { rows: CsvWorkerRow[] }) {
    return this.employersService.onboardWorkers(user.employerProfileId, body.rows);
  }
}
