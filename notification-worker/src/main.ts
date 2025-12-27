import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Redis from 'ioredis';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  });

  redis.on('error', (err) => {
    logger.error('❌ Redis connection failed', err);
    process.exit(1);
  });

  await redis.ping();
  logger.log('✅ Redis connected');

  await NestFactory.createApplicationContext(AppModule);
  logger.log('🚀 Notification Worker is running');
}

bootstrap();
