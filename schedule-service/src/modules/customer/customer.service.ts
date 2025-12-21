import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomerRepository } from '../../repository/postgres/customer.repository';
import { CustomerInput } from './dto/customer.input';
import { Customer, CustomerDetail, CustomerPagination } from './entities/customer.entity';
import { DeleteResponse } from '../../common/dto/delete-response.entity';
import { AuthenticationProvider } from '../../provider/authentication/authentication.provider';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly authenticationProvider: AuthenticationProvider
  ) { }

  async create(input: CustomerInput): Promise<Customer> {
    const existingByEmail =
      await this.customerRepository.findByEmail(input.email);

    if (existingByEmail) {
      throw new ConflictException('Email already exists');
    }

    return this.customerRepository.create(input);
  }

  async update(input: CustomerInput): Promise<Customer> {
    const existing = await this.customerRepository.findById(input.id);

    if (!existing) {
      throw new NotFoundException('Customer not found');
    }

    if (input.email && input.email !== existing.email) {
      const emailOwner =
        await this.customerRepository.findByEmail(input.email);

      if (emailOwner && emailOwner.id !== input.id) {
        throw new ConflictException('Email already exists');
      }
    }

    await this.authenticationProvider.updateEmail(input.id, input.email);

    return this.customerRepository.update(input.id, { email: input.email, name: input.name });
  }

  async findAllPaginated(page = 1, limit = 10): Promise<CustomerPagination> {
    const skip = (page - 1) * limit;

    const { data, total } =
      await this.customerRepository.findAll(skip, limit);

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<CustomerDetail> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async delete(id: string): Promise<DeleteResponse> {
    const deleted = await this.customerRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Customer not found');
    }

    await this.authenticationProvider.deleteUser(id);

    return {
      success: deleted,
      message: `${deleted ? "Success" : "Failed"} delete customer`
    };
  }
}
