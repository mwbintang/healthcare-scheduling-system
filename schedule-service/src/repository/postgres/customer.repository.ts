import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CustomerCreateInput) {
    return this.prisma.customer.create({ data });
  }

  async findAll(skip: number, take: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.customer.count(),
    ]);

    return { data, total };
  }

  findById(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        schedules: {
          include: {
            doctor: true,
            customer: true,
          },
          orderBy: {
            scheduledAt: 'asc',
          },
        },
      },
    });
  }

  update(id: string, data: Prisma.CustomerUpdateInput) {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.prisma.customer.deleteMany({
      where: { id },
    });

    return result.count > 0;
  }

  findByEmail(email: string) {
    return this.prisma.customer.findUnique({
      where: { email },
    });
  }
}
