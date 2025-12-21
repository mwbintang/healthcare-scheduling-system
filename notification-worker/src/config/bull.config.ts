import { BullRootModuleOptions } from '@nestjs/bullmq';

export const bullConfig: BullRootModuleOptions = {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
};
