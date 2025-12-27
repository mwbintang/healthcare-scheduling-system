import { Test, TestingModule } from '@nestjs/testing';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';
import { CustomerInput } from './dto/customer.input';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { GqlAuthOrApiKeyGuard } from '../../common/guards/gql-auth-or-api-key.guard';
import { GqlApiKeyGuard } from '../../common/guards/gql-api-key.guard';

describe('CustomerResolver', () => {
  let resolver: CustomerResolver;
  let customerService: jest.Mocked<CustomerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerResolver,
        {
          provide: CustomerService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findAllPaginated: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(GqlAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(GqlAuthOrApiKeyGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(GqlApiKeyGuard)
      .useValue({ canActivate: () => true })
      .compile();

    resolver = module.get<CustomerResolver>(CustomerResolver);
    customerService = module.get(CustomerService);
  });

  describe('createCustomer', () => {
    it('should call service.create', async () => {
      const input: CustomerInput = {
        email: 'test@mail.com',
        name: 'Test',
      } as CustomerInput;

      customerService.create.mockResolvedValue(input as any);

      const result = await resolver.createCustomer(input);

      expect(customerService.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(input);
    });
  });

  describe('customer', () => {
    it('should return customer detail', async () => {
      customerService.findById.mockResolvedValue({ id: '1' } as any);

      const result = await resolver.customer('1');

      expect(customerService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('customers', () => {
    it('should return paginated customers', async () => {
      customerService.findAllPaginated.mockResolvedValue({
        data: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      } as any);

      const result = await resolver.customers(1, 10);

      expect(customerService.findAllPaginated).toHaveBeenCalledWith(1, 10);
      expect(result.page).toBe(1);
    });
  });

  describe('updateCustomer', () => {
    it('should update customer', async () => {
      const input: CustomerInput = {
        id: '1',
        name: 'Updated',
      } as CustomerInput;

      customerService.update.mockResolvedValue(input as any);

      const result = await resolver.updateCustomer(input);

      expect(customerService.update).toHaveBeenCalledWith(input);
      expect(result).toEqual(input);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete customer using userId from context', async () => {
      customerService.delete.mockResolvedValue({
        success: true,
        message: 'Success delete customer',
      } as any);

      const ctx = {
        req: {
          user: {
            userId: 'user-1',
          },
        },
      };

      const result = await resolver.deleteCustomer(ctx);

      expect(customerService.delete).toHaveBeenCalledWith('user-1');
      expect(result.success).toBe(true);
    });
  });
});
