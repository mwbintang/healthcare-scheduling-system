import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Redis from 'ioredis';

async function bootstrap() {
  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  });

  redis.on('error', (err) => {
    console.error('❌ Redis connection failed', err);
    process.exit(1);
  });

  await redis.ping();
  console.log('✅ Redis connected');

  await NestFactory.createApplicationContext(AppModule);
  console.log('🚀 Notification Worker is running');
}

bootstrap();
