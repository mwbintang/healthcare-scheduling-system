import { CreateDoctorInput } from './create-doctor.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDoctorInput {
  @Field({ nullable: true }) name?: string;
}
