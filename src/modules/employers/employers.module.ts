import { Module } from '@nestjs/common';
import { EmployersService } from './employers.service';
import { EmployersController } from './employers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployerProfile } from './entities/employer-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployerProfile])],
  exports: [TypeOrmModule],
  providers: [EmployersService],
  controllers: [EmployersController],
})
export class EmployersModule {}
