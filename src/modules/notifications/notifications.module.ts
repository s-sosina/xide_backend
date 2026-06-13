import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { OrderEventsListener } from './listeners/order-events.listener';

@Module({
  providers: [NotificationsService, EmailService, SmsService, OrderEventsListener],
  exports: [NotificationsService, EmailService, SmsService],
})
export class NotificationsModule {}
