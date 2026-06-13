import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { EmployerStatus } from '../../../common/enums/employer-status.enum';

@Entity('employer_profiles')
export class EmployerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  organizationName: string;

  @Column()
  payrollEmail: string;

  @Column()
  phone: string;

  @Column()
  companySize: string;

  @Column({
    type: 'enum',
    enum: EmployerStatus,
    default: EmployerStatus.PENDING,
  })
  verificationStatus: EmployerStatus;

  @CreateDateColumn()
  createdAt: Date;
}
