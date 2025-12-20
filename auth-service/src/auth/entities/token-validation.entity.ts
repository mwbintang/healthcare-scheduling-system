import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class TokenValidationResult {
  @Field()
  userId: string

  @Field()
  email: string
}
