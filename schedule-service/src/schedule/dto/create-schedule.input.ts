import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateScheduleInput {
  @Field() doctorId: string;
  @Field() customerId: string;
  @Field() objective: string;
  @Field() scheduledAt: Date;
}
