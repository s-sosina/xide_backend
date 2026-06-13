import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RepaymentPlan } from '../../repayment-plans/entities/repayment-plan.entity';
import { WorkerProfile } from '../../workers/entities/worker-profile.entity';
import { EmployerProfile } from '../../employers/entities/employer-profile.entity';
import { RemittanceTransaction } from '../../remittances/entities/remittance-transaction.entity';

@Entity('deduction_records')
export class DeductionRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RepaymentPlan, plan => plan.deductionRecords)
  repaymentPlan: RepaymentPlan;

  @ManyToOne(() => WorkerProfile)
  worker: WorkerProfile;

  @ManyToOne(() => EmployerProfile)
  employer: EmployerProfile;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp' })
  expectedDeductionDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualDeductionDate: Date;

  @Column({ default: 'pending' })
  status: string; // pending, completed, failed

  @ManyToOne(() => RemittanceTransaction, { nullable: true })
  remittanceTransaction: RemittanceTransaction;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
