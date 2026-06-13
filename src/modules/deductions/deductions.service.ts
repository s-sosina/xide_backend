import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeductionRecord } from './entities/deduction-record.entity';

@Injectable()
export class DeductionsService {
  constructor(
    @InjectRepository(DeductionRecord)
    private readonly deductionRecordRepository: Repository<DeductionRecord>,
  ) {}
}
