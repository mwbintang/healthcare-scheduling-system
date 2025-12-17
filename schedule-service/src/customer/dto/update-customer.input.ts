import { CreateCustomerInput } from './create-customer.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCustomerInput {
  @Field({ nullable: true }) name?: string;
  @Field({ nullable: true }) email?: string;
}