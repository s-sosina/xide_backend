import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodPackage } from './entities/food-package.entity';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FoodPackage])],
  providers: [PackagesService],
  controllers: [PackagesController],
  exports: [PackagesService],
})
export class FoodPackagesModule {}
