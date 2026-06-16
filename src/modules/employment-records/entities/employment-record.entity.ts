import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { EmployerProfile } from '../../employers/entities/employer-profile.entity';
import { WorkerProfile } from '../../workers/entities/worker-profile.entity';
import { EmploymentStatus } from '../enums/employment-status.enum';

@Entity('employment_records')
@Unique(['employer', 'employeeNumber'])
export class EmploymentRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EmployerProfile)
  employer: EmployerProfile;

  @ManyToOne(() => WorkerProfile)
  worker: WorkerProfile;

  @Column()
  employeeNumber: string;

  @Column()
  department: string;

  @Column()
  jobTitle: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlySalary: number;

  @Column()
  salaryBand: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: EmploymentStatus,
    default: EmploymentStatus.PENDING,
  })
  status: EmploymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
