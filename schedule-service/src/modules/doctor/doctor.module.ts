import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorResolver } from './doctor.resolver';
import { RepositoryModule } from '../../repository/repository.module';
import { ProviderModule } from '../../provider/provider.module';

@Module({
  imports: [RepositoryModule, ProviderModule],
  providers: [DoctorResolver, DoctorService],
})
export class DoctorModule { }
