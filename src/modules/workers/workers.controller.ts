import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';

import { WorkersService } from './workers.service';
import { ActivateWorkerDto } from './dto/activate-worker.dto';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserRolesGuard } from '../../common/guards/user-roles.guard';
import { UserRoles } from '../../common/decorators/user-roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post('activate')
  @Public()
  @HttpCode(HttpStatus.OK)
  async activate(@Body() dto: ActivateWorkerDto) {
    return this.workersService.activate(dto);
  }

  @Post('complete-profile')
  @UseGuards(JwtAuthGuard, UserRolesGuard)
  @UserRoles(UserRole.WORKER)
  @HttpCode(HttpStatus.OK)
  async completeProfile(@GetUser() user: any, @Body() dto: CompleteProfileDto) {
    return this.workersService.completeProfile(user.userId, dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, UserRolesGuard)
  @UserRoles(UserRole.WORKER)
  async getProfile(@GetUser() user: any) {
    return this.workersService.findByUserId(user.userId);
  }
}
