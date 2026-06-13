import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { FoodProduct } from '../../food-products/entities/food-product.entity';
import { FoodPackage } from '../../food-packages/entities/food-package.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.items)
  order: Order;

  @ManyToOne(() => FoodProduct, { nullable: true })
  product: FoodProduct;

  @ManyToOne(() => FoodPackage, { nullable: true })
  package: FoodPackage;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtPurchase: number;

  @Column({ default: 1 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
