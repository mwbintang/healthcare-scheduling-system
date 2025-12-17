import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { RegisterInput } from './dto/register.input'
import { LoginInput } from './dto/login.input'
import { ValidateTokenInput } from './dto/validate-token.input'
import { AuthPayload } from './entities/auth.model'
import { TokenValidationResult } from './entities/token-validation.model'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  register(
    @Args('input') input: RegisterInput,
  ): Promise<AuthPayload> {
    return this.authService.register(input.email, input.password)
  }

  @Mutation(() => AuthPayload)
  login(
    @Args('input') input: LoginInput,
  ): Promise<AuthPayload> {
    return this.authService.login(input.email, input.password)
  }

  @Query(() => TokenValidationResult)
  validateToken(
    @Args('token') token: string,
  ): TokenValidationResult {
    return this.authService.validateToken(token)
  }
}
