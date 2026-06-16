import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { EmployerProfile } from './entities/employer-profile.entity';
import { WorkerProfile } from '../workers/entities/worker-profile.entity';
import { User } from '../users/entities/user.entity';
import { EmploymentRecord } from '../employment-records/entities/employment-record.entity';
import { EmailService } from '../notifications/email.service';
import { UserRole } from '../../common/enums/user-role.enum';
import { EmploymentStatus } from '../employment-records/enums/employment-status.enum';
import { generateWorkerCode } from '../../common/utils/crypto.util';

export interface CsvWorkerRow {
  email: string;
  firstName: string;
  lastName: string;
  employeeNumber: string;
  department: string;
  jobTitle: string;
  monthlySalary: number;
  salaryBand: string;
}

export interface OnboardingResult {
  email: string;
  status: 'created' | 'invited' | 'skipped';
  reason?: string;
}

@Injectable()
export class EmployersService {
  constructor(
    @InjectRepository(EmployerProfile)
    private readonly employerProfileRepository: Repository<EmployerProfile>,

    @InjectRepository(WorkerProfile)
    private readonly workerProfileRepository: Repository<WorkerProfile>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(EmploymentRecord)
    private readonly employmentRecordRepository: Repository<EmploymentRecord>,

    private readonly emailService: EmailService,
  ) {}

  async onboardWorkers(employerId: string, rows: CsvWorkerRow[]): Promise<OnboardingResult[]> {
    const employer = await this.employerProfileRepository.findOne({ where: { id: employerId } });
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }

    const results: OnboardingResult[] = [];

    for (const row of rows) {
      const { email, firstName, lastName, employeeNumber, department, jobTitle, monthlySalary, salaryBand } = row;

      try {
        const existingUser = await this.userRepository.findOne({ where: { email } });

        if (!existingUser) {
          // --- NEW WORKER FLOW ---
          const tempPassword = Math.random().toString(36).slice(-10);
          const hashedPassword = await bcrypt.hash(tempPassword, 12);

          const newUser = this.userRepository.create({
            email,
            password: hashedPassword,
            role: UserRole.WORKER,
            isActive: false,
          });
          await this.userRepository.save(newUser);

          // Generate unique workerCode
          let workerCode = '';
          let isUnique = false;
          let attempts = 0;
          while (!isUnique && attempts < 10) {
            workerCode = generateWorkerCode();
            const existing = await this.workerProfileRepository.findOne({ where: { workerCode } });
            if (!existing) isUnique = true;
            attempts++;
          }
          if (!isUnique) throw new BadRequestException('Failed to generate a unique worker code');

          const workerProfile = this.workerProfileRepository.create({
            user: newUser,
            workerCode,
            firstName,
            lastName,
            creditLimit: 0,
            creditBalance: 0,
          });
          await this.workerProfileRepository.save(workerProfile);

          const empRecord = this.employmentRecordRepository.create({
            employer,
            worker: workerProfile,
            employeeNumber,
            department,
            jobTitle,
            monthlySalary,
            salaryBand,
            status: EmploymentStatus.PENDING,
          });
          await this.employmentRecordRepository.save(empRecord);

          const activationLink = `https://xide.app/activate?email=${encodeURIComponent(email)}`;
          this.emailService.sendRegistrationLink(email, activationLink);

          results.push({ email, status: 'created' });
        } else {
          // --- EXISTING WORKER FLOW ---
          const workerProfile = await this.workerProfileRepository.findOne({
            where: { user: { id: existingUser.id } },
          });
          if (!workerProfile) {
            results.push({ email, status: 'skipped', reason: 'User exists but has no worker profile' });
            continue;
          }

          // Check for duplicate employment relationship
          const existingRel = await this.employmentRecordRepository.findOne({
            where: { employer: { id: employerId }, worker: { id: workerProfile.id } },
          });
          if (existingRel) {
            results.push({ email, status: 'skipped', reason: 'Employment record already exists for this employer' });
            continue;
          }

          const empRecord = this.employmentRecordRepository.create({
            employer,
            worker: workerProfile,
            employeeNumber,
            department,
            jobTitle,
            monthlySalary,
            salaryBand,
            status: EmploymentStatus.PENDING,
          });
          await this.employmentRecordRepository.save(empRecord);

          const invitationLink = `https://xide.app/invitations/${empRecord.id}/accept`;
          this.emailService.sendEmploymentInvitation(email, invitationLink);

          results.push({ email, status: 'invited' });
        }
      } catch (err) {
        results.push({ email, status: 'skipped', reason: err.message });
      }
    }

    return results;
  }
}
