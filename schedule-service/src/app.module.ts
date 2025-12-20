import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { GraphqlHealthModule } from './graphql-health/graphql-health.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProviderModule } from './provider/provider.module';
import { CustomerModule } from './customer/customer.module';
import { RepositoryModule } from './repository/repository.module';
import { DoctorModule } from './doctor/doctor.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      sortSchema: true
    }),
    GraphqlHealthModule,
    PrismaModule,
    ProviderModule,
    CustomerModule,
    DoctorModule,
    ScheduleModule,
    RepositoryModule,
    CommonModule
  ],
})
export class AppModule {}