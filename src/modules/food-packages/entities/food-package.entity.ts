import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { FoodProduct } from '../../food-products/entities/food-product.entity';

@Entity('food_packages')
export class FoodPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  imageUrl: string;

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToMany(() => FoodProduct)
  @JoinTable()
  products: FoodProduct[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
