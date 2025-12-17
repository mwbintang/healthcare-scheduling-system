import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ScheduleRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ScheduleCreateInput) {
    return this.prisma.schedule.create({ data });
  }

  findAll(
    where: Prisma.ScheduleWhereInput,
    skip: number,
    take: number,
  ) {
    return this.prisma.schedule.findMany({
      where,
      skip,
      take,
      include: {
        doctor: true,
        customer: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.schedule.findUnique({
      where: { id },
      include: {
        doctor: true,
        customer: true,
      },
    });
  }

  delete(id: string) {
    return this.prisma.schedule.delete({
      where: { id },
    });
  }
}
