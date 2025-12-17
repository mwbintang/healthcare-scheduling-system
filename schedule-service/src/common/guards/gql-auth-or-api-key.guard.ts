import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlAuthGuard } from './gql-auth.guard';
import { GqlApiKeyGuard } from './gql-api-key.guard';

@Injectable()
export class GqlAuthOrApiKeyGuard implements CanActivate {
  constructor(
    private readonly jwtGuard: GqlAuthGuard,
    private readonly apiKeyGuard: GqlApiKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await this.jwtGuard.canActivate(context);
    } catch (_) {
      return this.apiKeyGuard.canActivate(context);
    }
  }
}
