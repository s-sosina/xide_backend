import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EmploymentRecord } from '../../employment-records/entities/employment-record.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { RepaymentCycle } from '../../../common/enums/repayment-cycle.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EmploymentRecord)
  employment: EmploymentRecord;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: RepaymentCycle })
  repaymentCycle: RepaymentCycle;

  @Column()
  deliveryAddress: string;

  @Column({ type: 'timestamp', nullable: true })
  deliveryDate: Date;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
