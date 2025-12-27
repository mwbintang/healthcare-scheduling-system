import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { PrismaModule } from './prisma/prisma.module';
import { ProviderModule } from './provider/provider.module';
import { CustomerModule } from './modules/customer/customer.module';
import { RepositoryModule } from './repository/repository.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { CommonModule } from './common/common.module';
import { NotificationModule } from './modules/notification/notification.module';
import { BullModule } from '@nestjs/bullmq';
import { GraphqlHealthModule } from './modules/graphql-health/graphql-health.module';

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
    CommonModule,
    NotificationModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    })
  ],
})
export class AppModule {}