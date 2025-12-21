import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationModule } from './notification/notification.module';
import IORedis from 'ioredis';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    NotificationModule
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger('Redis');

  onModuleInit() {
    const redis = new IORedis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    redis.on('connect', () => {
      this.logger.log('✅ Redis connected');
    });

    redis.on('error', (err) => {
      this.logger.error('❌ Redis error', err);
    });

    redis.on('close', () => {
      this.logger.warn('⚠️ Redis connection closed');
    });

    redis.on('reconnecting', () => {
      this.logger.warn('🔄 Redis reconnecting...');
    });
  }
}