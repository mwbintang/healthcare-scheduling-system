import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { RegisterInput } from './dto/register.input'
import { LoginInput } from './dto/login.input'
import { ValidateTokenInput } from './dto/validate-token.input'
import { AuthUser } from './entities/auth.entitiy'
import { TokenValidationResult } from './entities/token-validation.entity'
import { UseGuards } from '@nestjs/common'
import { GqlApiKeyGuard } from '../common/guards/gql-api-key.guard'
import { CustomerProfile } from './entities/customer-profile.entity'
import { UpdateEmailInput } from './dto/update-email.input'
import { DeleteResponse } from './entities/delete-response.entity'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => AuthUser)
  register(
    @Args('input') input: RegisterInput,
  ): Promise<AuthUser> {
    return this.authService.register(input.name, input.email, input.password)
  }

  @Mutation(() => AuthUser)
  login(
    @Args('input') input: LoginInput,
  ): Promise<AuthUser> {
    return this.authService.login(input.email, input.password)
  }

  @UseGuards(GqlApiKeyGuard)
  @Query(() => TokenValidationResult)
  validateToken(
    @Args('token') token: string,
  ): Promise<TokenValidationResult> {
    return this.authService.validateToken(token)
  }

  @UseGuards(GqlApiKeyGuard)
  @Mutation(() => CustomerProfile)
  updateEmail(
    @Args('input') input: UpdateEmailInput,
  ): Promise<CustomerProfile> {
    return this.authService.updateEmail(input.id, input.email);
  }

  @UseGuards(GqlApiKeyGuard)
  @Mutation(() => DeleteResponse)
  deleteUser(@Args('id') id: string): Promise<DeleteResponse> {
    return this.authService.delete(id);
  }
}
