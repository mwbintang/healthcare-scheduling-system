import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { NOTIFICATION_QUEUE, notifType } from '../../constants/type';

describe('NotificationService', () => {
  let service: NotificationService;
  let queue: jest.Mocked<Queue>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getQueueToken(NOTIFICATION_QUEUE),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(NotificationService);
    queue = module.get(getQueueToken(NOTIFICATION_QUEUE));
  });

  describe('sendSchedule', () => {
    it('should add CREATE notification job to queue', async () => {
      queue.add.mockResolvedValue({ id: 'job-1' } as any);

      await service.sendSchedule({
        email: 'test@mail.com',
        message: 'Schedule created',
        type: notifType.CREATE,
      });

      expect(queue.add).toHaveBeenCalledWith(
        'notification',
        {
          to: 'test@mail.com',
          subject: 'Schedule Created',
          text: 'Schedule created',
        },
        {
          attempts: 5,
          backoff: { type: 'exponential', delay: 5000 },
        },
      );
    });

    it('should add DELETE notification job to queue', async () => {
      queue.add.mockResolvedValue({ id: 'job-2' } as any);

      await service.sendSchedule({
        email: 'test@mail.com',
        message: 'Schedule deleted',
        type: notifType.DELETE,
      });

      expect(queue.add).toHaveBeenCalledWith(
        'notification',
        {
          to: 'test@mail.com',
          subject: 'Schedule Deleted',
          text: 'Schedule deleted',
        },
        expect.any(Object),
      );
    });

    it('should catch and log error if queue fails', async () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      queue.add.mockRejectedValue(new Error('Queue error'));

      await service.sendSchedule({
        email: 'test@mail.com',
        message: 'Error case',
        type: notifType.CREATE,
      });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
