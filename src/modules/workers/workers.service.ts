import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { WorkerProfile } from './entities/worker-profile.entity';
import { User } from '../users/entities/user.entity';
import { EmploymentRecord } from '../employment-records/entities/employment-record.entity';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { ActivateWorkerDto } from './dto/activate-worker.dto';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { EmploymentStatus } from '../employment-records/enums/employment-status.enum';
import { generateWorkerCode } from '../../common/utils/crypto.util';

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(WorkerProfile)
    private readonly workerProfileRepository: Repository<WorkerProfile>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(EmploymentRecord)
    private readonly employmentRecordRepository: Repository<EmploymentRecord>,
  ) {}

  async create(createWorkerDto: CreateWorkerDto): Promise<WorkerProfile> {
    const { userId, firstName, lastName } = createWorkerDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate unique workerCode
    let workerCode = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      workerCode = generateWorkerCode();
      const existing = await this.workerProfileRepository.findOne({ where: { workerCode } });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new BadRequestException('Failed to generate a unique worker code');
    }

    const workerProfile = this.workerProfileRepository.create({
      user,
      workerCode,
      firstName,
      lastName,
      creditLimit: 0,
      creditBalance: 0,
    });

    return this.workerProfileRepository.save(workerProfile);
  }

  async activate(dto: ActivateWorkerDto): Promise<any> {
    const { email, password, phone, address } = dto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const workerProfile = await this.workerProfileRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (!workerProfile) {
      throw new NotFoundException('Worker profile not found');
    }

    // Update password and ensure user is active
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.isActive = true;
    await this.userRepository.save(user);

    // Update worker details
    workerProfile.phone = phone;
    workerProfile.address = address;
    await this.workerProfileRepository.save(workerProfile);

    // Activate pending employment record if worker doesn't have an active one
    const pendingEmployments = await this.employmentRecordRepository.find({
      where: {
        worker: { id: workerProfile.id },
        status: EmploymentStatus.PENDING,
      },
    });

    if (pendingEmployments.length > 0) {
      const activeEmployment = await this.employmentRecordRepository.findOne({
        where: {
          worker: { id: workerProfile.id },
          status: EmploymentStatus.ACTIVE,
        },
      });

      if (activeEmployment) {
        throw new BadRequestException('Worker already has an active employment record.');
      }

      // Activate the first pending record (MVP rule)
      const empRecord = pendingEmployments[0];
      empRecord.status = EmploymentStatus.ACTIVE;
      empRecord.startDate = new Date();
      await this.employmentRecordRepository.save(empRecord);
    }

    return { message: 'Worker account and profile activated successfully.' };
  }

  async completeProfile(userId: string, dto: CompleteProfileDto): Promise<WorkerProfile> {
    const workerProfile = await this.workerProfileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!workerProfile) {
      throw new NotFoundException('Worker profile not found');
    }

    workerProfile.phone = dto.phone;
    workerProfile.address = dto.address;
    return this.workerProfileRepository.save(workerProfile);
  }

  async findOne(id: string): Promise<WorkerProfile> {
    const profile = await this.workerProfileRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!profile) {
      throw new NotFoundException('Worker profile not found');
    }
    return profile;
  }

  async findByUserId(userId: string): Promise<WorkerProfile> {
    const profile = await this.workerProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });
    if (!profile) {
      throw new NotFoundException('Worker profile not found');
    }
    return profile;
  }

  async updateCredit(id: string, updateCreditDto: UpdateCreditDto): Promise<WorkerProfile> {
    const workerProfile = await this.workerProfileRepository.findOne({ where: { id } });
    if (!workerProfile) {
      throw new NotFoundException('Worker profile not found');
    }
    workerProfile.creditBalance = Number(workerProfile.creditBalance) + updateCreditDto.amount;
    return this.workerProfileRepository.save(workerProfile);
  }
}
