import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodProduct } from './entities/food-product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FoodProduct])],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class FoodProductsModule {}
