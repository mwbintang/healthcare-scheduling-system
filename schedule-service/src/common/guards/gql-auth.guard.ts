import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthenticationProvider } from "../../provider/authentication/authentication.provider";

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private readonly authProvider: AuthenticationProvider,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException("Missing authorization token");
    }

    const user = await this.authProvider.validateToken(token);

    req.user = user;
    return true;
  }
}
