import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
class CustomerSchedule {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;
}

@ObjectType()
class ScheduleDoctor {
  @Field(() => ID)
  id: string;

  @Field()
  objective: string;

  @Field()
  scheduledAt: Date;

  @Field(() => CustomerSchedule)
  customer: CustomerSchedule;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class Doctor {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class DoctorPagination {
  @Field(() => [Doctor])
  data: Doctor[];

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  totalPages: number;
}

@ObjectType()
export class DoctorDetail {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [ScheduleDoctor])
  schedules: ScheduleDoctor[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}