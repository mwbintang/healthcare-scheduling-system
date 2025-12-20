import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class DoctorInput {
  @Field() name: string;
}