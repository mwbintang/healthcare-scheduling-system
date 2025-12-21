import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';


interface FindAllParams {
  doctorId?: string;
  customerId?: string;
  skip?: number;
  take?: number;
}

@Injectable()
export class ScheduleRepository {
  constructor(private prisma: PrismaService) { }

  // Create schedule
  async create(data: {
    scheduledAt: Date;
    objective: string;
    doctorId: string;
    customerId: string;
  }): Promise<any> {
    return this.prisma.schedule.create({
      data: {
        scheduledAt: data.scheduledAt,
        objective: data.objective,
        doctor: { connect: { id: data.doctorId } },
        customer: { connect: { id: data.customerId } },
      },
      include: {
        doctor: true,
        customer: true,
      },
    });
  }

  // Find schedule by ID
  async findById(id: string): Promise<any> {
    return this.prisma.schedule.findUnique({
      where: { id },
      include: { doctor: true, customer: true },
    });
  }

  // Find all with filters and pagination
  async findAll(params: FindAllParams): Promise<any[]> {
    const { doctorId, customerId, skip = 0, take = 10 } = params;

    return this.prisma.schedule.findMany({
      where: {
        doctorId,
        customerId,
      },
      include: { doctor: true, customer: true },
      skip,
      take,
      orderBy: { scheduledAt: 'asc' },
    });
  }

  // Count for pagination
  async count(params: { doctorId?: string; customerId?: string }): Promise<number> {
    return this.prisma.schedule.count({
      where: { doctorId: params.doctorId, customerId: params.customerId },
    });
  }

  // Check schedule conflict
  async findConflict(doctorId: string, scheduledAt: Date): Promise<any> {
    return this.prisma.schedule.findFirst({
      where: {
        doctorId,
        scheduledAt: {
          gte: scheduledAt,       // starts after or at the new time
          lt: new Date(scheduledAt.getTime() + 60 * 60 * 1000), // ends before 1 hour later
        },
      },
    });
  }

  // Delete schedule
  async delete(id: string): Promise<boolean> {
    const result = await this.prisma.schedule.deleteMany({ where: { id } });

    return result.count > 0;
  }
}
