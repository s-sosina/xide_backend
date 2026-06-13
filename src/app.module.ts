import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import paystackConfig from './config/paystack.config';
import emailConfig from './config/email.config';
import { validationSchema } from './config/validation.schema';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkersModule } from './modules/workers/workers.module';
import { EmployersModule } from './modules/employers/employers.module';
import { FoodProductsModule } from './modules/food-products/products.module';
import { FoodPackagesModule } from './modules/food-packages/packages.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RepaymentPlansModule } from './modules/repayment-plans/repayment.module';
import { DeductionsModule } from './modules/deductions/deductions.module';
import { RemittancesModule } from './modules/remittances/remittance.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, paystackConfig, emailConfig],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    WorkersModule,
    EmployersModule,
    FoodProductsModule,
    FoodPackagesModule,
    CartModule,
    OrdersModule,
    RepaymentPlansModule,
    DeductionsModule,
    RemittancesModule,
    NotificationsModule,
    ReportsModule,
    AnalyticsModule,
    AdminModule,
  ],
})
export class AppModule {}
