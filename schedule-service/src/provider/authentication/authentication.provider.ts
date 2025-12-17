import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ProviderAbstract } from "../provider.abstract";

@Injectable()
export class AuthenticationProvider extends ProviderAbstract {
  constructor() {
    const baseUrl = process.env.AUTHENTICATION_SERVICE;

    if (!baseUrl) {
      throw new Error("AUTHENTICATION_SERVICE is not defined");
    }

    super(baseUrl);
  }

  async validateToken(token: string): Promise<AuthUser> {
    try {
      const jwt = token.replace(/^Bearer\s+/i, "");

      const query = `
  query ValidateToken($token: String!) {
    validateToken(token: $token) {
      userId
      email
    }
  }
`;

      const response = await this.transporter.post(
        "/graphql",
        {
          query,
          variables: {
            token: jwt,
          },
        },
        {
          headers: {
            "x-api-key": process.env.API_KEY,
          },
        },
      );

      if (response.data.errors) {
        throw new UnauthorizedException(
          response.data.errors[0].message,
        );
      }

      return response.data.data.validateToken;
    } catch (error) {
      console.error(
        error.response?.data || error.message,
      );
      throw new UnauthorizedException("Invalid token");
    }
  }

}

export interface AuthUser {
  userId: string;
  email: string;
  role?: string;
}
