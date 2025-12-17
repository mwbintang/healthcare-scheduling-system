import { Injectable, NotFoundException } from "@nestjs/common";
import { ScheduleRepository } from "../repository/postgres/schedule.repository";
import { CreateScheduleInput } from "./dto/create-schedule.input";

@Injectable()
export class ScheduleService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  /**
   * Create new schedule
   */
  create(input: CreateScheduleInput) {
    return this.scheduleRepository.create({
      scheduledAt: input.scheduledAt,
      objective: input.objective,
      doctor: {
        connect: { id: input.doctorId },
      },
      customer: {
        connect: { id: input.customerId },
      },
    });
  }

  /**
   * Get list of schedules with filter & pagination
   */
  findAll(params: {
    doctorId?: string;
    customerId?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      doctorId,
      customerId,
      page = 1,
      limit = 10,
    } = params;

    const skip = (page - 1) * limit;

    return this.scheduleRepository.findAll(
      {
        doctorId,
        customerId,
      },
      skip,
      limit,
    );
  }

  /**
   * Get schedule by ID
   */
  async findById(id: string) {
    const schedule = await this.scheduleRepository.findById(id);

    if (!schedule) {
      throw new NotFoundException("Schedule not found");
    }

    return schedule;
  }

  /**
   * Delete schedule by ID
   */
  async delete(id: string): Promise<boolean> {
    await this.findById(id); // ensure exists
    await this.scheduleRepository.delete(id);
    return true;
  }
}
