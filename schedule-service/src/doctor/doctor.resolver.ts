import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DoctorService } from './doctor.service';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorInput } from './dto/create-doctor.input';
import { UpdateDoctorInput } from './dto/update-doctor.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';

@Resolver(() => Doctor)
@UseGuards(GqlAuthGuard)
export class DoctorResolver {
  constructor(private doctorService: DoctorService) {}

  @Mutation(() => Doctor)
  createDoctor(@Args('input') input: CreateDoctorInput) {
    return this.doctorService.create(input);
  }

  @Mutation(() => Doctor)
  updateDoctor(
    @Args('id') id: string,
    @Args('input') input: UpdateDoctorInput,
  ) {
    return this.doctorService.update(id, input);
  }

  @Query(() => [Doctor])
  doctors(
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
  ) {
    return this.doctorService.findAll(page, limit);
  }

  @Query(() => Doctor)
  doctor(@Args('id') id: string) {
    return this.doctorService.findById(id);
  }

  @Mutation(() => Boolean)
  deleteDoctor(@Args('id') id: string) {
    return this.doctorService.delete(id);
  }
}
