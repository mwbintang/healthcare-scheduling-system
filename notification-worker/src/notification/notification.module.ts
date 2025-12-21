import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { NOTIFICATION_QUEUE } from 'src/contsants/type';
import { NotificationProcessor } from './notification.processor';
import { MailService } from 'src/services/mail.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
    }),
  ],
  providers: [
    NotificationProcessor,
    MailService,
  ],
})
export class NotificationModule { }
