import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { GqlApiKeyGuard } from '../common/guards/gql-api-key.guard';
import { GqlAuthOrApiKeyGuard } from '../common/guards/gql-auth-or-api-key.guard';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private customerService: CustomerService) {}

  @UseGuards(GqlApiKeyGuard)
  @Mutation(() => Customer)
  createCustomer(@Args('input') input: CreateCustomerInput) {
    return this.customerService.create(input);
  }

  @UseGuards(GqlAuthOrApiKeyGuard)
  @Query(() => Customer)
  customer(@Args('id') id: string) {
    return this.customerService.findById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Customer])
  customers(
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
  ) {
    return this.customerService.findAll(page, limit);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Customer)
  updateCustomer(
    @Args('id') id: string,
    @Args('input') input: UpdateCustomerInput,
  ) {
    return this.customerService.update(id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteCustomer(@Args('id') id: string) {
    return this.customerService.delete(id);
  }
}
