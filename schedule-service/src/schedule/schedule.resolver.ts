import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ScheduleService } from './schedule.service';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Schedule)
@UseGuards(GqlAuthGuard)
export class ScheduleResolver {
  constructor(private scheduleService: ScheduleService) {}

  @Mutation(() => Schedule)
  createSchedule(@Args('input') input: CreateScheduleInput) {
    return this.scheduleService.create(input);
  }

  @Query(() => [Schedule])
  schedules(
    @Args('doctorId', { nullable: true }) doctorId?: string,
    @Args('customerId', { nullable: true }) customerId?: string,
    @Args('page', { defaultValue: 1 }) page?: number,
    @Args('limit', { defaultValue: 10 }) limit?: number,
  ) {
    return this.scheduleService.findAll({ doctorId, customerId, page, limit });
  }

  @Query(() => Schedule)
  schedule(@Args('id') id: string) {
    return this.scheduleService.findById(id);
  }

  @Mutation(() => Boolean)
  deleteSchedule(@Args('id') id: string) {
    return this.scheduleService.delete(id);
  }
}
