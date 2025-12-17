import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class DoctorRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.DoctorCreateInput) {
    return this.prisma.doctor.create({ data });
  }

  findAll(skip: number, take: number) {
    return this.prisma.doctor.findMany({
      skip,
      take,
    });
  }

  findById(id: string) {
    return this.prisma.doctor.findUnique({
      where: { id },
    });
  }

  update(id: string, data: Prisma.DoctorUpdateInput) {
    return this.prisma.doctor.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.doctor.delete({
      where: { id },
    });
  }
}
