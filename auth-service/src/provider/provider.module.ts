import { Module } from "@nestjs/common";
import { ScheduleProvider } from "./schedule/schedule.provider";

@Module({
  providers: [ScheduleProvider],
  exports: [ScheduleProvider],
})
export class ProviderModule {}
