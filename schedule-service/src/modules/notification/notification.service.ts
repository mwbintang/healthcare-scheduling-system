import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { NOTIFICATION_QUEUE, notifType } from '../../constants/type';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE)
    private readonly queue: Queue
  ) { }

  async sendSchedule(payload: {
    email: string;
    message: string;
    type: string;
  }) {
    try {
      const queueRes = await this.queue.add(
        'notification',
        {
          to: payload.email,
          subject: payload.type == notifType.CREATE ? 'Schedule Created' : 'Schedule Deleted',
          text: payload.message,
          // html
        },
        {
          attempts: 5,
          backoff: { type: 'exponential', delay: 5000 },
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
