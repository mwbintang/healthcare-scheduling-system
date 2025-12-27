import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleResolver } from './schedule.resolver';
import { ScheduleService } from './schedule.service';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { GqlAuthOrApiKeyGuard } from '../../common/guards/gql-auth-or-api-key.guard';
import { GqlApiKeyGuard } from '../../common/guards/gql-api-key.guard';

describe('ScheduleResolver', () => {
  let resolver: ScheduleResolver;
  let scheduleService: jest.Mocked<ScheduleService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleResolver,
        {
          provide: ScheduleService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(GqlAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(GqlAuthOrApiKeyGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(GqlApiKeyGuard)
      .useValue({ canActivate: () => true })
      .compile();

    resolver = module.get<ScheduleResolver>(ScheduleResolver);
    scheduleService = module.get(ScheduleService);
  });

  const ctxMock = {
    req: {
      user: {
        userId: 'user-1',
        email: 'user@mail.com',
      },
    },
  };

  describe('createSchedule', () => {
    it('should create schedule with customerId & email from context', async () => {
      const input: CreateScheduleInput = {
        doctorId: 'doc-1',
        scheduledAt: new Date().toISOString(),
        objective: 'Checkup',
      };

      scheduleService.create.mockResolvedValue({ id: 'sch-1' } as any);

      const result = await resolver.createSchedule(input, ctxMock);

      expect(scheduleService.create).toHaveBeenCalledWith({
        ...input,
        customerId: 'user-1',
        email: 'user@mail.com',
      });
      expect(result.id).toBe('sch-1');
    });
  });

  describe('schedule', () => {
    it('should return schedule detail for authenticated user', async () => {
      scheduleService.findById.mockResolvedValue({ id: 'sch-1' } as any);

      const result = await resolver.schedule('sch-1', ctxMock);

      expect(scheduleService.findById).toHaveBeenCalledWith('user-1', 'sch-1');
      expect(result.id).toBe('sch-1');
    });
  });

  describe('schedules', () => {
    it('should return paginated schedules for user', async () => {
      scheduleService.findAll.mockResolvedValue({
        items: [],
        page: 1,
        limit: 10,
        total: 0,
      } as any);

      const result = await resolver.schedules(ctxMock, 1, 10);

      expect(scheduleService.findAll).toHaveBeenCalledWith({
        customerId: 'user-1',
        page: 1,
        limit: 10,
      });
      expect(result.page).toBe(1);
    });
  });

  describe('deleteSchedule', () => {
    it('should delete schedule and return DeleteResponse', async () => {
      scheduleService.delete.mockResolvedValue(true);

      const result = await resolver.deleteSchedule('sch-1', ctxMock);

      expect(scheduleService.delete).toHaveBeenCalledWith(
        'user-1',
        'user@mail.com',
        'sch-1',
      );
      expect(result).toEqual({
        success: true,
        message: 'Schedule deleted successfully',
      });
    });

    it('should return failed message if delete fails', async () => {
      scheduleService.delete.mockResolvedValue(false);

      const result = await resolver.deleteSchedule('sch-1', ctxMock);

      expect(result).toEqual({
        success: false,
        message: 'Schedule deleted failed',
      });
    });
  });
});
