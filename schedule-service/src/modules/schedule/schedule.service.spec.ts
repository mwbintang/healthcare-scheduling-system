import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleRepository } from '../../repository/postgres/schedule.repository';
import { DoctorService } from '../doctor/doctor.service';
import { CustomerService } from '../customer/customer.service';
import { NotificationService } from '../notification/notification.service';
import { RedisService } from '../../common/redis/redis.service';
import { notifType } from '../../constants/type';
import { ScheduleCacheKey } from '../../constants/cache-key';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let scheduleRepo: jest.Mocked<ScheduleRepository>;
  let doctorService: jest.Mocked<DoctorService>;
  let customerService: jest.Mocked<CustomerService>;
  let notificationService: jest.Mocked<NotificationService>;
  let redisService: jest.Mocked<RedisService>;

  const scheduleMock = {
    id: 'sch-1',
    scheduledAt: new Date(),
    objective: 'Checkup',
    doctorId: 'doc-1',
    customerId: 'cus-1',
    doctor: { id: 'doc-1' },
    customer: { id: 'cus-1' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: ScheduleRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            count: jest.fn(),
            delete: jest.fn(),
            findConflict: jest.fn(),
          },
        },
        {
          provide: DoctorService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: CustomerService,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            sendSchedule: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            delByPattern: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ScheduleService);
    scheduleRepo = module.get(ScheduleRepository);
    doctorService = module.get(DoctorService);
    customerService = module.get(CustomerService);
    notificationService = module.get(NotificationService);
    redisService = module.get(RedisService);
  });

  describe('create', () => {
    it('should create schedule successfully', async () => {
      doctorService.findById.mockResolvedValue({ id: 'doc-1' } as any);
      customerService.findById.mockResolvedValue({ id: 'cus-1' } as any);
      scheduleRepo.findConflict.mockResolvedValue(null);
      scheduleRepo.create.mockResolvedValue(scheduleMock as any);

      const result = await service.create({
        doctorId: 'doc-1',
        customerId: 'cus-1',
        scheduledAt: new Date().toISOString(),
        objective: 'Checkup',
        email: 'test@mail.com',
      });

      expect(scheduleRepo.create).toHaveBeenCalled();
      expect(notificationService.sendSchedule).toHaveBeenCalledWith({
        email: 'test@mail.com',
        type: notifType.CREATE,
        message: expect.any(String),
      });
      expect(result.id).toBe(scheduleMock.id);
    });

    it('should throw NotFoundException if doctor not found', async () => {
      doctorService.findById.mockResolvedValue(null as any);

      await expect(
        service.create({
          doctorId: 'doc-1',
          customerId: 'cus-1',
          scheduledAt: new Date().toISOString(),
          objective: 'Checkup',
          email: 'test@mail.com',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on conflict', async () => {
      doctorService.findById.mockResolvedValue({ id: 'doc-1' } as any);
      customerService.findById.mockResolvedValue({ id: 'cus-1' } as any);
      scheduleRepo.findConflict.mockResolvedValue(true as any);

      await expect(
        service.create({
          doctorId: 'doc-1',
          customerId: 'cus-1',
          scheduledAt: new Date().toISOString(),
          objective: 'Checkup',
          email: 'test@mail.com',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return cached schedule', async () => {
      const cacheKey = ScheduleCacheKey.byId('sch-1');
      redisService.get.mockResolvedValue({ id: 'sch-1' } as any);

      const result = await service.findById('cus-1', 'sch-1');

      expect(redisService.get).toHaveBeenCalledWith(cacheKey);
      expect(result.id).toBe('sch-1');
    });

    it('should fetch from DB and cache it', async () => {
      redisService.get.mockResolvedValue(null);
      scheduleRepo.findById.mockResolvedValue(scheduleMock as any);

      const result = await service.findById('cus-1', 'sch-1');

      expect(redisService.set).toHaveBeenCalled();
      expect(result.id).toBe(scheduleMock.id);
    });

    it('should deny access if not owner', async () => {
      redisService.get.mockResolvedValue(null);
      scheduleRepo.findById.mockResolvedValue({
        ...scheduleMock,
        customerId: 'other',
      } as any);

      await expect(
        service.findById('cus-1', 'sch-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated schedules and cache result', async () => {
      redisService.get.mockResolvedValue(null);
      scheduleRepo.findAll.mockResolvedValue([scheduleMock] as any);
      scheduleRepo.count.mockResolvedValue(1);

      const result = await service.findAll({
        customerId: 'cus-1',
        page: 1,
        limit: 10,
      });

      expect(result.items.length).toBe(1);
      expect(redisService.set).toHaveBeenCalled();
    });

    it('should return cached list', async () => {
      redisService.get.mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        limit: 10,
      } as any);

      const result = await service.findAll({});

      expect(result.total).toBe(0);
      expect(scheduleRepo.findAll).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete schedule successfully', async () => {
      scheduleRepo.findById.mockResolvedValue(scheduleMock as any);
      scheduleRepo.delete.mockResolvedValue(true);

      const result = await service.delete('cus-1', 'test@mail.com', 'sch-1');

      expect(notificationService.sendSchedule).toHaveBeenCalledWith({
        email: 'test@mail.com',
        type: notifType.DELETE,
        message: expect.any(String),
      });
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if schedule not found', async () => {
      scheduleRepo.findById.mockResolvedValue(null);

      await expect(
        service.delete('cus-1', 'test@mail.com', 'sch-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should deny delete if not owner', async () => {
      scheduleRepo.findById.mockResolvedValue({
        ...scheduleMock,
        customerId: 'other',
      } as any);

      await expect(
        service.delete('cus-1', 'test@mail.com', 'sch-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
