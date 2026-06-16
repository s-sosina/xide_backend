import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmploymentRecord } from './entities/employment-record.entity';
import { WorkerProfile } from '../workers/entities/worker-profile.entity';
import { EmployerProfile } from '../employers/entities/employer-profile.entity';
import { EmploymentRecordsService } from './employment-records.service';
import { EmploymentRecordsController } from './employment-records.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmploymentRecord, WorkerProfile, EmployerProfile])],
  providers: [EmploymentRecordsService],
  controllers: [EmploymentRecordsController],
  exports: [EmploymentRecordsService, TypeOrmModule],
})
export class EmploymentRecordsModule {}
