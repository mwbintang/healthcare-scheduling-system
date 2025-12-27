import { Module } from '@nestjs/common';
import { GraphqlHealthResolver } from './graphql-health.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GraphqlHealthResolver]
})
export class GraphqlHealthModule {}
