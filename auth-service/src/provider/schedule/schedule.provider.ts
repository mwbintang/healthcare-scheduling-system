import { Injectable, NotFoundException } from "@nestjs/common";
import { ProviderAbstract } from "../provider.abstract";

@Injectable()
export class ScheduleProvider extends ProviderAbstract {
  constructor() {
    const baseUrl = process.env.SCHEDULE_SERVICE;

    if (!baseUrl) {
      throw new Error("SCHEDULE_SERVICE is not defined");
    }

    super(baseUrl);
  }

  // ✅ CREATE USER (Customer)
  async createUser(input: CreateCustomerInput) {
    const query = `
      mutation CreateCustomer($input: CustomerInput!) {
        createCustomer(input: $input) {
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
        variables: { input },
      },
      {
        headers: {
          "x-api-key": process.env.API_KEY,
        },
      },
    );

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.createCustomer;
  }

  // ✅ FIND USER BY ID
  async findById(id: string) {
    const query = `
      query FindCustomerById($id: ID!) {
        customer(id: $id) {
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
        variables: { id },
      },
      {
        headers: {
          "x-api-key": process.env.API_KEY,
        },
      },
    );

    if (response.data.errors) {
      throw new NotFoundException(
        response.data.errors[0].message,
      );
    }

    if (!response.data.data.customer) {
      throw new NotFoundException("Customer not found");
    }

    return response.data.data.customer;
  }
}

export interface CreateCustomerInput {
  id: string;
  name: string;
  email: string;
}