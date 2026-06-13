import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { EmployerProfile } from '../employers/entities/employer-profile.entity';
import { EmployerRegisterDto } from '../employers/dto/register-employer.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(EmployerProfile)
    private readonly employerRepository: Repository<EmployerProfile>,

    private readonly jwtService: JwtService,

    private readonly dataSource: DataSource,
  ) {}

  async registerEmployer(dto: EmployerRegisterDto): Promise<AuthResponseDto> {
    const {
      organizationName,
      payrollEmail,
      phone,
      companySize,
      password,
      acceptedTerms,
    } = dto;

    if (!acceptedTerms) {
      throw new BadRequestException('Terms must be accepted');
    }

    // 1. Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: payrollEmail },
    });

    if (existingUser) {
      throw new ConflictException('Employer already exists');
    }

    // 2. Wrap multi-table inserts in a Database Transaction (ACID compliance)
    return this.dataSource.transaction(async (manager) => {
      // 3. Hash the password inside the service layer
      const hashedPassword = await bcrypt.hash(password, 12);

      // 4. Create and persist User record
      const user = manager.create(User, {
        email: payrollEmail,
        password: hashedPassword,
        role: UserRole.EMPLOYER,
      });
      const savedUser = await manager.save(user);

      // 5. Create and persist EmployerProfile record linked to User
      const employer = manager.create(EmployerProfile, {
        user: savedUser,
        organizationName,
        payrollEmail,
        phone,
        companySize,
      });
      const savedEmployer = await manager.save(employer);

      // 6. Generate authentication tokens
      const payload = {
        sub: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      // 7. Map to DTO for response
      return {
        accessToken,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          role: savedUser.role,
        },
        employer: {
          id: savedEmployer.id,
          organizationName: savedEmployer.organizationName,
          verificationStatus: savedEmployer.verificationStatus,
        },
      };
    });
  }
}
