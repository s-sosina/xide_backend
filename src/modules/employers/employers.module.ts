import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployersService } from './employers.service';
import { EmployersController } from './employers.controller';
import { EmployerProfile } from './entities/employer-profile.entity';
import { WorkerProfile } from '../workers/entities/worker-profile.entity';
import { User } from '../users/entities/user.entity';
import { EmploymentRecord } from '../employment-records/entities/employment-record.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployerProfile, WorkerProfile, User, EmploymentRecord]),
    NotificationsModule,
  ],
  exports: [TypeOrmModule],
  providers: [EmployersService],
  controllers: [EmployersController],
})
export class EmployersModule {}
