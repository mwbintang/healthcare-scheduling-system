import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleResolver } from './schedule.resolver';
import { RepositoryModule } from '../repository/repository.module';
import { ProviderModule } from '../provider/provider.module';
import { DoctorService } from '../doctor/doctor.service';
import { CustomerService } from '../customer/customer.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [RepositoryModule, ProviderModule, CommonModule],
  providers: [ScheduleResolver, ScheduleService, DoctorService, CustomerService],
})
export class ScheduleModule { }
