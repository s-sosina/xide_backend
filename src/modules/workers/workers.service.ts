import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkerProfile } from './entities/worker-profile.entity';

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(WorkerProfile)
    private readonly workerProfileRepository: Repository<WorkerProfile>,
  ) {}
}
