import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeductionRecord } from './entities/deduction-record.entity';
import { DeductionsService } from './deductions.service';
import { DeductionsController } from './deductions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeductionRecord])],
  providers: [DeductionsService],
  controllers: [DeductionsController],
  exports: [DeductionsService],
})
export class DeductionsModule {}
