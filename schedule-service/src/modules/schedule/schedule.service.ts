import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { Schedule, ScheduleDetail, SchedulePagination } from './entities/schedule.entity';
import { ScheduleRepository } from '../../repository/postgres/schedule.repository';
import { DoctorService } from '../doctor/doctor.service';
import { CustomerService } from '../customer/customer.service';
import { NotificationService } from '../notification/notification.service';
import { notifType } from '../../constants/type';
import { RedisService } from '../../common/redis/redis.service';
import { ScheduleCacheKey } from '../../constants/cache-key';
import { twoMinutes } from '../../constants/time';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly doctorService: DoctorService,
    private readonly customerService: CustomerService,
    private readonly notificationService: NotificationService,
    private readonly redisService: RedisService
  ) { }

  // 🔹 Create schedule
  async create(input: CreateScheduleInput & { customerId: string, email: string }): Promise<Schedule> {
    const { doctorId, customerId, scheduledAt, objective, email } = input;

    const doctor = await this.doctorService.findById(doctorId);
    if (!doctor) throw new NotFoundException('Doctor not found');

    const customer = await this.customerService.findById(customerId);
    if (!customer) throw new NotFoundException('Customer not found');

    const scheduledDate = new Date(scheduledAt);

    const conflict = await this.scheduleRepository.findConflict(doctorId, scheduledDate);
    if (conflict) throw new BadRequestException('Schedule conflict');

    const [created] = await Promise.all([
      this.scheduleRepository.create({
        doctorId,
        customerId,
        scheduledAt: scheduledDate,
        objective,
      }),
      this.redisService.delByPattern('schedule:list:*'),
      this.notificationService.sendSchedule({
        email: email,
        type: notifType.CREATE,
        message: 'Your schedule has been successfully created',
      })
    ]);

    return this.mapToGraphQL(created);
  }

  // 🔹 Find by ID
  async findById(userId: string, id: string): Promise<ScheduleDetail> {
    const cacheKey = ScheduleCacheKey.byId(id);

    const cached = await this.redisService.get<ScheduleDetail>(cacheKey);
    if (cached) {
      return cached;
    }

    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) throw new NotFoundException('Schedule not found');

    if (schedule.customerId !== userId && schedule.doctorId !== userId) {
      throw new BadRequestException('You do not have access to this schedule');
    }

    const result = this.mapToGraphQL(schedule);

    await this.redisService.set(cacheKey, result, twoMinutes);

    return result;
  }


  // 🔹 Find all with pagination
  async findAll(params: {
    customerId?: string;
    page?: number;
    limit?: number;
  }): Promise<SchedulePagination> {
    const {  customerId, page = 1, limit = 10 } = params;

    const cacheKey = ScheduleCacheKey.list(params);
    const cached = await this.redisService.get<SchedulePagination>(cacheKey);
    if (cached) {
      return cached;
    }

    const skip = (page - 1) * limit;

    const [schedules, total] = await Promise.all([
      this.scheduleRepository.findAll({ customerId, skip, take: limit }),
      this.scheduleRepository.count({ customerId }),
    ]);

    const result: SchedulePagination = {
      items: schedules.map((s) => this.mapToGraphQL(s)),
      total,
      page,
      limit,
    };

    await this.redisService.set(cacheKey, result, twoMinutes);

    return result;
  }

  // 🔹 Delete
  async delete(userId: string, email: string, id: string): Promise<boolean> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) throw new NotFoundException('Schedule not found');

    // Ownership check
    if (schedule.customerId !== userId && schedule.doctorId !== userId) {
      throw new BadRequestException('You do not have access to delete this schedule');
    }

    await this.notificationService.sendSchedule({
      email,
      type: notifType.DELETE,
      message: 'Your schedule has been successfully deleted',
    });

    await Promise.all([
      this.redisService.del(ScheduleCacheKey.byId(id)),
      this.redisService.delByPattern('schedule:list:*'),
    ]);

    const result = await this.scheduleRepository.delete(id);

    return result;
  }

  // 🔹 Helper to map DB result to GraphQL Schedule / ScheduleDetail
  private mapToGraphQL(s: any): Schedule | ScheduleDetail {
    return {
      id: s.id,
      scheduledAt: s.scheduledAt.toISOString(),
      objective: s.objective,
      doctor: s.doctor,
      customer: s.customer,
    };
  }
}
