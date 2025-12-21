import { Resolver, Query, Mutation, Args, Int, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from './entities/schedule.entity';
import { SchedulePagination } from './entities/schedule.entity';
import { ScheduleDetail } from './entities/schedule.entity';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { DeleteResponse } from '../../common/dto/delete-response.entity';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { GqlApiKeyGuard } from '../../common/guards/gql-api-key.guard';
import { GqlAuthOrApiKeyGuard } from '../../common/guards/gql-auth-or-api-key.guard';

@Resolver(() => Schedule)
export class ScheduleResolver {
  constructor(private readonly scheduleService: ScheduleService) { }

  // 🔹 Create Schedule
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Schedule)
  createSchedule(
    @Args('input') input: CreateScheduleInput,
    @Context() ctx: any,
  ): Promise<Schedule> {
    const user = ctx.req.user;

    // inject authenticated user as customerId
    return this.scheduleService.create({
      ...input,
      customerId: user.userId,
      email: user.email
    });
  }

  // 🔹 Detail Schedule
  @UseGuards(GqlAuthOrApiKeyGuard)
  @Query(() => ScheduleDetail)
  schedule(
    @Args('id', { type: () => ID }) id: string,
    @Context() ctx: any,
  ): Promise<ScheduleDetail> {
    const user = ctx.req.user;
    return this.scheduleService.findById(user.userId, id);
  }

  // 🔹 Paginated List
  @UseGuards(GqlAuthGuard)
  @Query(() => SchedulePagination)
  schedules(
    @Context() ctx: any,
    @Args('doctorId', { type: () => ID, nullable: true }) doctorId?: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
  ): Promise<SchedulePagination> {
    const user = ctx.req.user;
    return this.scheduleService.findAll({
      doctorId,
      customerId: user.userId,
      page,
      limit,
    });
  }

  // 🔹 Delete Schedule
  @UseGuards(GqlAuthGuard)
  @Mutation(() => DeleteResponse)
  async deleteSchedule(
    @Args('id', { type: () => ID }) id: string,
    @Context() ctx: any,
  ): Promise<DeleteResponse> {
    const user = ctx.req.user;
    const result = await this.scheduleService.delete(user.userId, user.email, id);

    return {
      success: result,
      message: `Schedule deleted ${result ? "successfully" : "failed"}`,
    };
  }
}
