import { Controller, Post, Get, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';

import { EmploymentRecordsService } from './employment-records.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserRolesGuard } from '../../common/guards/user-roles.guard';
import { UserRoles } from '../../common/decorators/user-roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('employment-records')
@UseGuards(JwtAuthGuard, UserRolesGuard)
export class EmploymentRecordsController {
  constructor(private readonly employmentRecordsService: EmploymentRecordsService) {}

  @Post(':id/accept')
  @UserRoles(UserRole.WORKER)
  @HttpCode(HttpStatus.OK)
  async acceptInvitation(@Param('id') id: string, @GetUser() user: any) {
    return this.employmentRecordsService.acceptInvitation(id, user.userId);
  }

  @Get('active')
  @UserRoles(UserRole.WORKER)
  async getActive(@GetUser() user: any) {
    return this.employmentRecordsService.findActiveByWorker(user.userId);
  }
}
