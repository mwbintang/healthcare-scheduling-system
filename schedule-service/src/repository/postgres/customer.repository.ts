import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CustomerCreateInput) {
    return this.prisma.customer.create({ data });
  }

  findAll(skip: number, take: number) {
    return this.prisma.customer.findMany({
      skip,
      take,
    });
  }

  findById(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  update(id: string, data: Prisma.CustomerUpdateInput) {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
