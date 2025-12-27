import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ProviderAbstract } from "../provider.abstract";
import { DeleteResponse } from "../../common/dto/delete-response.entity";

@Injectable()
export class AuthenticationProvider extends ProviderAbstract {
  private readonly logger = new Logger(AuthenticationProvider.name)
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
      this.logger.error(
        error.response?.data || error.message,
      );
      throw new UnauthorizedException("Invalid token");
    }
  }

  async updateEmail(id: string, email: string): Promise<AuthUser> {
    try {
      const query = `
  mutation UpdateEmail($input: UpdateEmailInput!) {
        updateEmail(input: $input) {
          id
          name
          email
        }
      }
`;

      const response = await this.transporter.post(
        "/graphql",
        {
          query,
          variables: {
            input: {
              id,
              email,
            },
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

      return response.data.data.updateEmail;
    } catch (error) {
      this.logger.error(
        error.response?.data || error.message,
      );
      throw new UnauthorizedException("Invalid token");
    }
  }

  async deleteUser(id: string): Promise<DeleteResponse> {
    try {
      const query = `
  mutation DeleteUser($id: String!) {
  deleteUser(id: $id) {
    success
    message
  }
}
`;

      const response = await this.transporter.post(
        "/graphql",
        {
          query,
          variables: {
            id
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

      return response.data.data.deleteUser;
    } catch (error) {
      this.logger.error(
        error.response?.data || error.message
      );
      throw new UnauthorizedException("Invalid token");
    }
  }
}

export interface AuthUser {
  userId: string;
  email: string;
}

export interface UpdateEmail {
  id: string;
  email: string;
}