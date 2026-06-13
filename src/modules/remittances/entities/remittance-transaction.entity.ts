import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EmployerProfile } from '../../employers/entities/employer-profile.entity';
import { DeductionRecord } from '../../deductions/entities/deduction-record.entity';

@Entity('remittance_transactions')
export class RemittanceTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EmployerProfile)
  employer: EmployerProfile;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ unique: true })
  reference: string;

  @Column({ default: 'pending' })
  status: string; // pending, success, failed

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @OneToMany(() => DeductionRecord, rec => rec.remittanceTransaction)
  deductionRecords: DeductionRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
