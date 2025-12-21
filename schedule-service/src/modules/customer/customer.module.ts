import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerResolver } from './customer.resolver';
import { RepositoryModule } from '../../repository/repository.module';
import { ProviderModule } from '../../provider/provider.module';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [RepositoryModule, ProviderModule, CommonModule, ProviderModule],
  providers: [CustomerService, CustomerResolver],
})
export class CustomerModule {}

