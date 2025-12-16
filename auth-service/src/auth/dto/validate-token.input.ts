import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class ValidateTokenInput {
  @Field()
  token: string
}
