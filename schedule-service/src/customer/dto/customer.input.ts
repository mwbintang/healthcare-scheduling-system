import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CustomerInput {
  @Field() id: string;
  @Field() name: string;
  @Field() email: string;
}