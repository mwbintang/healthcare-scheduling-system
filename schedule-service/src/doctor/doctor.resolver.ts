import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DoctorService } from './doctor.service';
import { Doctor, DoctorDetail, DoctorPagination } from './entities/doctor.entity';
import { DoctorInput } from './dto/doctor.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { DeleteResponse } from '../common/dto/delete-response.entity';

@Resolver(() => Doctor)
@UseGuards(GqlAuthGuard)
export class DoctorResolver {
  constructor(private doctorService: DoctorService) { }

  @Mutation(() => Doctor)
  createDoctor(@Args('input') input: DoctorInput): Promise<Doctor> {
    return this.doctorService.create(input);
  }

  @Mutation(() => Doctor)
  updateDoctor(
    @Args('id') id: string,
    @Args('input') input: DoctorInput,
  ): Promise<Doctor> {
    return this.doctorService.update(id, input);
  }

  @Query(() => DoctorPagination)
  doctors(
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
  ): Promise<DoctorPagination> {
    return this.doctorService.findAll(page, limit);
  }

  @Query(() => DoctorDetail)
  doctor(@Args('id') id: string): Promise<DoctorDetail> {
    return this.doctorService.findById(id);
  }

  @Mutation(() => DeleteResponse)
  deleteDoctor(@Args('id') id: string): Promise<DeleteResponse> {
    return this.doctorService.delete(id);
  }
}
