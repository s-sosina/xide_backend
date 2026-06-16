import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EmploymentRecord } from './entities/employment-record.entity';
import { CreateEmploymentRecordDto } from './dto/create-employment-record.dto';
import { EmploymentStatus } from './enums/employment-status.enum';
import { WorkerProfile } from '../workers/entities/worker-profile.entity';
import { EmployerProfile } from '../employers/entities/employer-profile.entity';

@Injectable()
export class EmploymentRecordsService {
  constructor(
    @InjectRepository(EmploymentRecord)
    private readonly employmentRecordRepository: Repository<EmploymentRecord>,

    @InjectRepository(WorkerProfile)
    private readonly workerProfileRepository: Repository<WorkerProfile>,

    @InjectRepository(EmployerProfile)
    private readonly employerProfileRepository: Repository<EmployerProfile>,
  ) {}

  async create(dto: CreateEmploymentRecordDto): Promise<EmploymentRecord> {
    const {
      employerId,
      workerId,
      employeeNumber,
      department,
      jobTitle,
      monthlySalary,
      salaryBand,
      status,
    } = dto;

    const worker = await this.workerProfileRepository.findOne({ where: { id: workerId } });
    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    const employer = await this.employerProfileRepository.findOne({ where: { id: employerId } });
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }

    const existingNum = await this.employmentRecordRepository.findOne({
      where: { employer: { id: employerId }, employeeNumber },
    });
    if (existingNum) {
      throw new ConflictException(`Employee number ${employeeNumber} is already in use for this employer`);
    }

    const existingRel = await this.employmentRecordRepository.findOne({
      where: { employer: { id: employerId }, worker: { id: workerId } },
    });
    if (existingRel) {
      throw new ConflictException('Employment record for this worker and employer already exists');
    }

    const record = this.employmentRecordRepository.create({
      employer,
      worker,
      employeeNumber,
      department,
      jobTitle,
      monthlySalary,
      salaryBand,
      status: status || EmploymentStatus.PENDING,
    });

    return this.employmentRecordRepository.save(record);
  }

  async acceptInvitation(id: string, userId: string): Promise<EmploymentRecord> {
    const record = await this.employmentRecordRepository.findOne({
      where: { id },
      relations: { worker: { user: true } },
    });

    if (!record) {
      throw new NotFoundException('Employment record not found');
    }

    if (record.worker.user.id !== userId) {
      throw new BadRequestException('This invitation does not belong to you');
    }

    if (record.status !== EmploymentStatus.PENDING) {
      throw new BadRequestException(`Invitation is not pending (current status: ${record.status})`);
    }

    const activeRecord = await this.employmentRecordRepository.findOne({
      where: { worker: { id: record.worker.id }, status: EmploymentStatus.ACTIVE },
    });

    if (activeRecord) {
      throw new BadRequestException('You already have an active employment record on the platform');
    }

    record.status = EmploymentStatus.ACTIVE;
    record.startDate = new Date();
    return this.employmentRecordRepository.save(record);
  }

  async findActiveByWorker(userId: string): Promise<EmploymentRecord> {
    const worker = await this.workerProfileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    const record = await this.employmentRecordRepository.findOne({
      where: { worker: { id: worker.id }, status: EmploymentStatus.ACTIVE },
      relations: { employer: true, worker: true },
    });

    if (!record) {
      throw new NotFoundException('No active employment record found');
    }

    return record;
  }

  async findAllByWorker(userId: string): Promise<EmploymentRecord[]> {
    const worker = await this.workerProfileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    return this.employmentRecordRepository.find({
      where: { worker: { id: worker.id } },
      relations: { employer: true },
    });
  }

  async updateStatus(id: string, status: EmploymentStatus): Promise<EmploymentRecord> {
    const record = await this.employmentRecordRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException('Employment record not found');
    }

    if (status === EmploymentStatus.ACTIVE) {
      const activeRecord = await this.employmentRecordRepository.findOne({
        where: { worker: { id: record.worker.id }, status: EmploymentStatus.ACTIVE },
      });
      if (activeRecord && activeRecord.id !== record.id) {
        throw new BadRequestException('Worker already has an active employment record');
      }
    }

    record.status = status;
    if (status === EmploymentStatus.TERMINATED) {
      record.endDate = new Date();
    }
    return this.employmentRecordRepository.save(record);
  }
}
