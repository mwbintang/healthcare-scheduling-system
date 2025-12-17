import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CustomerRepository } from "./postgres/customer.repository";
import { DoctorRepository } from "./postgres/doctor.repository";
import { ScheduleRepository } from "./postgres/schedule.repository";

@Module({
  imports: [PrismaModule],
  providers: [
    CustomerRepository,
    DoctorRepository,
    ScheduleRepository,
  ],
  exports: [
    CustomerRepository,
    DoctorRepository,
    ScheduleRepository,
  ],
})
export class RepositoryModule {}
