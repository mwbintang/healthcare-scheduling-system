import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateScheduleInput {
  @Field(() => ID)
  doctorId: string;

  @Field()
  scheduledAt: string; // ISO date string

  @Field()
  objective: string;
}
