import { Module } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { GqlApiKeyGuard } from './guards/gql-api-key.guard';
import { GqlAuthOrApiKeyGuard } from './guards/gql-auth-or-api-key.guard';
import { ProviderModule } from '../provider/provider.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [ProviderModule], // needed if guards inject services
  providers: [
    GqlAuthGuard,
    GqlApiKeyGuard,
    GqlAuthOrApiKeyGuard,
    RedisService
  ],
  exports: [
    GqlAuthGuard,
    GqlApiKeyGuard,
    GqlAuthOrApiKeyGuard,
    RedisService
  ],
})
export class CommonModule {}
