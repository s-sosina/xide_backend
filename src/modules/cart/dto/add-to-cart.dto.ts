import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
