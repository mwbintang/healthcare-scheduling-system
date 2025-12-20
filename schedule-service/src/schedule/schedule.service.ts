import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { Schedule, ScheduleDetail, SchedulePagination } from './entities/schedule.entity';
import { ScheduleRepository } from '../repository/postgres/schedule.repository';
import { DoctorService } from '../doctor/doctor.service';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly doctorService: DoctorService,
    private readonly customerService: CustomerService,
  ) {}

  // 🔹 Create schedule
  async create(input: CreateScheduleInput & { customerId: string }): Promise<Schedule> {
    const { doctorId, customerId, scheduledAt, objective } = input;

    const doctor = await this.doctorService.findById(doctorId);
    if (!doctor) throw new NotFoundException('Doctor not found');

    const customer = await this.customerService.findById(customerId);
    if (!customer) throw new NotFoundException('Customer not found');

    const scheduledDate = new Date(scheduledAt);

    const conflict = await this.scheduleRepository.findConflict(doctorId, scheduledDate);
    if (conflict) throw new BadRequestException('Schedule conflict');

    const created = await this.scheduleRepository.create({
      doctorId,
      customerId,
      scheduledAt: scheduledDate,
      objective,
    });

    return this.mapToGraphQL(created);
  }

  // 🔹 Find by ID
  async findById(userId: string, id: string): Promise<ScheduleDetail> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) throw new NotFoundException('Schedule not found');

    // Ownership check
    if (schedule.customerId !== userId && schedule.doctorId !== userId) {
      throw new BadRequestException('You do not have access to this schedule');
    }

    return this.mapToGraphQL(schedule);
  }

  // 🔹 Find all with pagination
  async findAll(params: {
    doctorId?: string;
    customerId?: string;
    page?: number;
    limit?: number;
  }): Promise<SchedulePagination> {
    const { doctorId, customerId, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [schedules, total] = await Promise.all([
      this.scheduleRepository.findAll({ doctorId, customerId, skip, take: limit }),
      this.scheduleRepository.count({ doctorId, customerId }),
    ]);

    const items = schedules.map((s) => this.mapToGraphQL(s));

    return { items, total, page, limit };
  }

  // 🔹 Delete
  async delete(userId: string, id: string): Promise<void> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) throw new NotFoundException('Schedule not found');

    // Ownership check
    if (schedule.customerId !== userId && schedule.doctorId !== userId) {
      throw new BadRequestException('You do not have access to delete this schedule');
    }

    await this.scheduleRepository.delete(id);
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
