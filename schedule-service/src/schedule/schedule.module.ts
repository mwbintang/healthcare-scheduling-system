import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleResolver } from './schedule.resolver';
import { RepositoryModule } from '../repository/repository.module';
import { ProviderModule } from '../provider/provider.module';

@Module({
  imports: [RepositoryModule, ProviderModule],
  providers: [ScheduleResolver, ScheduleService],
})
export class ScheduleModule { }
