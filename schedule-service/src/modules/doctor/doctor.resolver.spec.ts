import { Test, TestingModule } from '@nestjs/testing';
import { DoctorResolver } from './doctor.resolver';
import { DoctorService } from './doctor.service';
import { DoctorInput } from './dto/doctor.input';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { GqlAuthOrApiKeyGuard } from '../../common/guards/gql-auth-or-api-key.guard';
import { GqlApiKeyGuard } from '../../common/guards/gql-api-key.guard';

describe('DoctorResolver', () => {
  let resolver: DoctorResolver;
  let doctorService: jest.Mocked<DoctorService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorResolver,
        {
          provide: DoctorService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
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

    resolver = module.get<DoctorResolver>(DoctorResolver);
    doctorService = module.get(DoctorService);
  });

  describe('createDoctor', () => {
    it('should create doctor', async () => {
      const input: DoctorInput = {
        name: 'Dr John',
      } as DoctorInput;

      doctorService.create.mockResolvedValue(input as any);

      const result = await resolver.createDoctor(input);

      expect(doctorService.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(input);
    });
  });

  describe('updateDoctor', () => {
    it('should update doctor', async () => {
      const id = '1';
      const input: DoctorInput = {
        name: 'Updated Doctor',
      } as DoctorInput;

      doctorService.update.mockResolvedValue({ id, ...input } as any);

      const result = await resolver.updateDoctor(id, input);

      expect(doctorService.update).toHaveBeenCalledWith(id, input);
      expect(result).toEqual({ id, ...input });
    });
  });

  describe('doctors', () => {
    it('should return paginated doctors', async () => {
      doctorService.findAll.mockResolvedValue({
        data: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      } as any);

      const result = await resolver.doctors(1, 10);

      expect(doctorService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result.page).toBe(1);
    });
  });

  describe('doctor', () => {
    it('should return doctor detail', async () => {
      doctorService.findById.mockResolvedValue({ id: '1' } as any);

      const result = await resolver.doctor('1');

      expect(doctorService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('deleteDoctor', () => {
    it('should delete doctor', async () => {
      doctorService.delete.mockResolvedValue({
        success: true,
        message: 'Success delete doctor',
      } as any);

      const result = await resolver.deleteDoctor('1');

      expect(doctorService.delete).toHaveBeenCalledWith('1');
      expect(result.success).toBe(true);
    });
  });
});
