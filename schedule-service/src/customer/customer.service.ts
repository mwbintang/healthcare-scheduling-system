import { Injectable, NotFoundException } from "@nestjs/common";
import { CustomerRepository } from "../repository/postgres/customer.repository";

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
  ) {}

  create(input) {
    return this.customerRepository.create(input);
  }

  async update(id: string, input) {
    const existing = await this.customerRepository.findById(id);
    if (!existing) {
      throw new NotFoundException("Customer not found");
    }

    return this.customerRepository.update(id, input);
  }

  findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.customerRepository.findAll(skip, limit);
  }

  async findById(id: string) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }
    return customer;
  }

  async delete(id: string) {
    const existing = await this.customerRepository.findById(id);
    if (!existing) {
      throw new NotFoundException("Customer not found");
    }

    await this.customerRepository.delete(id);
    return true;
  }
}
