import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkerProfile } from './entities/worker-profile.entity';
import { User } from '../users/entities/user.entity';
import { EmploymentRecord } from '../employment-records/entities/employment-record.entity';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkerProfile, User, EmploymentRecord]),
  ],
  providers: [WorkersService],
  controllers: [WorkersController],
  exports: [WorkersService, TypeOrmModule],
})
export class WorkersModule {}
