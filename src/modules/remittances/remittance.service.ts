import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RemittanceTransaction } from './entities/remittance-transaction.entity';

@Injectable()
export class RemittanceService {
  constructor(
    @InjectRepository(RemittanceTransaction)
    private readonly remittanceTransactionRepository: Repository<RemittanceTransaction>,
  ) {}
}
