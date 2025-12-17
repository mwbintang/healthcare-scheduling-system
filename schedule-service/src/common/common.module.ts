import { Module } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { GqlApiKeyGuard } from './guards/gql-api-key.guard';
import { GqlAuthOrApiKeyGuard } from './guards/gql-auth-or-api-key.guard';
import { ProviderModule } from '../provider/provider.module';

@Module({
  imports: [ProviderModule], // needed if guards inject services
  providers: [
    GqlAuthGuard,
    GqlApiKeyGuard,
    GqlAuthOrApiKeyGuard,
  ],
  exports: [
    GqlAuthGuard,
    GqlApiKeyGuard,
    GqlAuthOrApiKeyGuard,
  ],
})
export class CommonModule {}
