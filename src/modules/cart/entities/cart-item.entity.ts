import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { FoodProduct } from '../../food-products/entities/food-product.entity';
import { FoodPackage } from '../../food-packages/entities/food-package.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, cart => cart.items)
  cart: Cart;

  @ManyToOne(() => FoodProduct, { nullable: true })
  product: FoodProduct;

  @ManyToOne(() => FoodPackage, { nullable: true })
  package: FoodPackage;

  @Column({ default: 1 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
