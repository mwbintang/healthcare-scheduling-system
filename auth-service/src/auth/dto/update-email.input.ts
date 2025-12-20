import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateEmailInput {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;
}
