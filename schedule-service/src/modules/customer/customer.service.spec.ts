import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerRepository } from '../../repository/postgres/customer.repository';
import { AuthenticationProvider } from '../../provider/authentication/authentication.provider';
import { CustomerInput } from './dto/customer.input';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepository: jest.Mocked<CustomerRepository>;
  let authProvider: jest.Mocked<AuthenticationProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: CustomerRepository,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: AuthenticationProvider,
          useValue: {
            updateEmail: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepository = module.get(CustomerRepository);
    authProvider = module.get(AuthenticationProvider);
  });

  describe('create', () => {
    it('should create customer successfully', async () => {
      const input: CustomerInput = {
        email: 'test@mail.com',
        name: 'Test',
      } as CustomerInput;

      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.create.mockResolvedValue(input as any);

      const result = await service.create(input);

      expect(customerRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(customerRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(input);
    });

    it('should throw ConflictException if email exists', async () => {
      customerRepository.findByEmail.mockResolvedValue({ id: '1' } as any);

      await expect(
        service.create({ email: 'test@mail.com' } as CustomerInput),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update customer successfully', async () => {
      const input: CustomerInput = {
        id: '1',
        email: 'new@mail.com',
        name: 'New Name',
      } as CustomerInput;

      customerRepository.findById.mockResolvedValue({
        id: '1',
        email: 'old@mail.com',
      } as any);

      customerRepository.findByEmail.mockResolvedValue(null);
      customerRepository.update.mockResolvedValue(input as any);

      const result = await service.update(input);

      expect(authProvider.updateEmail).toHaveBeenCalledWith(
        input.id,
        input.email,
      );

      expect(customerRepository.update).toHaveBeenCalledWith(input.id, {
        email: input.email,
        name: input.name,
      });

      expect(result).toEqual(input);
    });

    it('should throw NotFoundException if customer not found', async () => {
      customerRepository.findById.mockResolvedValue(null);

      await expect(
        service.update({ id: '1' } as CustomerInput),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if email belongs to another user', async () => {
      customerRepository.findById.mockResolvedValue({
        id: '1',
        email: 'old@mail.com',
      } as any);

      customerRepository.findByEmail.mockResolvedValue({
        id: '2',
        email: 'new@mail.com',
      } as any);

      await expect(
        service.update({
          id: '1',
          email: 'new@mail.com',
        } as CustomerInput),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated customers', async () => {
      customerRepository.findAll.mockResolvedValue({
        data: [{ id: '1' }],
        total: 1,
      } as any);

      const result = await service.findAllPaginated(1, 10);

      expect(result).toEqual({
        data: [{ id: '1' }],
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe('findById', () => {
    it('should return customer detail', async () => {
      customerRepository.findById.mockResolvedValue({ id: '1' } as any);

      const result = await service.findById('1');

      expect(result).toEqual({ id: '1' });
    });

    it('should throw NotFoundException if not found', async () => {
      customerRepository.findById.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete customer successfully', async () => {
      customerRepository.delete.mockResolvedValue(true);

      const result = await service.delete('1');

      expect(authProvider.deleteUser).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        success: true,
        message: 'Success delete customer',
      });
    });

    it('should throw NotFoundException if customer not found', async () => {
      customerRepository.delete.mockResolvedValue(false);

      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
});
