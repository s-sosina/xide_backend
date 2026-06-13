import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodPackage } from './entities/food-package.entity';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(FoodPackage)
    private readonly packageRepository: Repository<FoodPackage>,
  ) {}
}
