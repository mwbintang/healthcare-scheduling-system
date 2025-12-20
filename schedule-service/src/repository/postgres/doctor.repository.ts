import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DoctorRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.DoctorCreateInput) {
    return this.prisma.doctor.create({
      data,
    });
  }

  async findAll(skip: number, take: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.doctor.findMany({
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.doctor.count(),
    ]);

    return {
      data,
      total,
    };
  }

  findById(id: string) {
    return this.prisma.doctor.findUnique({
      where: { id },
      include: {
        schedules: {
          include: {
            customer: true,
          },
          orderBy: {
            scheduledAt: 'asc',
          },
        },
      },
    });
  }

  update(id: string, data: Prisma.DoctorUpdateInput) {
    return this.prisma.doctor.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.prisma.doctor.deleteMany({
      where: { id },
    });

    return result.count > 0;
  }
}
