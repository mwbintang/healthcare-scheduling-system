import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Customer {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CustomerPagination {
  @Field(() => [Customer])
  data: Customer[];

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
export class DoctorSchedule {
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
export class ScheduleCustomer {
  @Field(() => ID)
  id: string;

  @Field()
  objective: string;

  @Field()
  scheduledAt: Date;

  @Field(() => DoctorSchedule)
  doctor: DoctorSchedule;

  @Field(() => Customer)
  customer: Customer;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CustomerDetail {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => [ScheduleCustomer])
  schedules: ScheduleCustomer[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}