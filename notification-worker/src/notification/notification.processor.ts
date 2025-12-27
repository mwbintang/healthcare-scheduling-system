import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from '../services/mail.service';
import { SendMailPayload } from 'src/config/mail.config';
import { NOTIFICATION_QUEUE } from 'src/constants/type';

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<SendMailPayload>) {
    await this.mailService.sendMail(job.data);
  }
}
