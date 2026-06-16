import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { EmploymentRecord } from '../../employment-records/entities/employment-record.entity';
import { DeductionRecord } from '../../deductions/entities/deduction-record.entity';

@Entity('repayment_plans')
export class RepaymentPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;

  @ManyToOne(() => EmploymentRecord)
  employment: EmploymentRecord;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  @Column()
  cycleCount: number;

  @Column()
  remainingCycles: number;

  @Column({ default: 'active' })
  status: string; // active, paid, defaulted

  @Column({ type: 'timestamp' })
  startDate: Date;

  @OneToMany(() => DeductionRecord, rec => rec.repaymentPlan)
  deductionRecords: DeductionRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
