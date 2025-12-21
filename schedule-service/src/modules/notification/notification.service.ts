import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { NOTIFICATION_QUEUE, notifType } from '../../../constants/type';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE)
    private readonly queue: Queue,
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
      console.error(error);
    }
  }
}
