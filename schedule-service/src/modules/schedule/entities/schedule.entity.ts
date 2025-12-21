import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { Customer } from '../../customer/entities/customer.entity';

@ObjectType()
export class Schedule {
  @Field(() => ID)
  id: string;

  @Field()
  scheduledAt: string;

  @Field()
  objective: string;

  @Field(() => Doctor)
  doctor: Doctor;

  @Field(() => Customer)
  customer: Customer;
}

@ObjectType()
export class SchedulePagination {
  @Field(() => [Schedule])
  items: Schedule[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}

@ObjectType()
export class ScheduleDetail {
  @Field(() => ID)
  id: string;

  @Field()
  scheduledAt: string;

  @Field()
  objective: string;

  @Field(() => Doctor)
  doctor: Doctor;

  @Field(() => Customer)
  customer: Customer;
}