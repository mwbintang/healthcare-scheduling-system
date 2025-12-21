import { Resolver, Query, Mutation, Args, Int, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CustomerPagination } from './entities/customer.entity';
import { CustomerDetail } from './entities/customer.entity';
import { DeleteResponse } from '../../common/dto/delete-response.entity';
import { CustomerInput } from './dto/customer.input';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { GqlApiKeyGuard } from '../../common/guards/gql-api-key.guard';
import { GqlAuthOrApiKeyGuard } from '../../common/guards/gql-auth-or-api-key.guard';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) { }

  // 🔹 Create
  @UseGuards(GqlApiKeyGuard)
  @Mutation(() => Customer)
  createCustomer(@Args('input') input: CustomerInput): Promise<Customer> {
    return this.customerService.create(input);
  }

  // 🔹 Detail (with schedules)
  @UseGuards(GqlAuthOrApiKeyGuard)
  @Query(() => CustomerDetail)
  customer(@Args('id', { type: () => ID }) id: string): Promise<CustomerDetail> {
    return this.customerService.findById(id);
  }

  // 🔹 Paginated list
  @UseGuards(GqlAuthGuard)
  @Query(() => CustomerPagination)
  customers(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<CustomerPagination> {
    return this.customerService.findAllPaginated(page, limit);
  }

  // 🔹 Update
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Customer)
  updateCustomer(
    @Args('input') input: CustomerInput,
  ): Promise<Customer> {
    return this.customerService.update(input);
  }

  // 🔹 Delete (message-based)
  @UseGuards(GqlAuthGuard)
  @Mutation(() => DeleteResponse)
  deleteCustomer(
    @Context() ctx: any
  ): Promise<DeleteResponse> {
    const user = ctx.req.user;
    return this.customerService.delete(user.userId);
  }
}
