import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CustomerProfile } from './customer-profile.entity';

@ObjectType()
export class AuthUser {
  @Field()
  token: string;

  @Field(() => CustomerProfile)
  profile: CustomerProfile;
};