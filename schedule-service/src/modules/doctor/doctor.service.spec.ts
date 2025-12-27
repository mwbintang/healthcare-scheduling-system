import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorRepository } from '../../repository/postgres/doctor.repository';
import { DoctorInput } from './dto/doctor.input';

describe('DoctorService', () => {
  let service: DoctorService;
  let doctorRepository: jest.Mocked<DoctorRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService,
        {
          provide: DoctorRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
    doctorRepository = module.get(DoctorRepository);
  });

  describe('create', () => {
    it('should create doctor successfully', async () => {
      const input: DoctorInput = {
        name: 'Dr John',
      } as DoctorInput;

      doctorRepository.create.mockResolvedValue(input as any);

      const result = await service.create(input);

      expect(doctorRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(input);
    });
  });

  describe('update', () => {
    it('should update doctor successfully', async () => {
      const id = '1';
      const input: DoctorInput = {
        name: 'Dr Updated',
      } as DoctorInput;

      doctorRepository.findById.mockResolvedValue({ id } as any);
      doctorRepository.update.mockResolvedValue({ id, ...input } as any);

      const result = await service.update(id, input);

      expect(doctorRepository.findById).toHaveBeenCalledWith(id);
      expect(doctorRepository.update).toHaveBeenCalledWith(id, input);
      expect(result).toEqual({ id, ...input });
    });

    it('should throw NotFoundException if doctor not found', async () => {
      doctorRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('1', {} as DoctorInput),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated doctors', async () => {
      doctorRepository.findAll.mockResolvedValue({
        data: [{ id: '1' }],
        total: 1,
      } as any);

      const result = await service.findAll(1, 10);

      expect(doctorRepository.findAll).toHaveBeenCalledWith(0, 10);
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
    it('should return doctor detail', async () => {
      doctorRepository.findById.mockResolvedValue({ id: '1' } as any);

      const result = await service.findById('1');

      expect(doctorRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1' });
    });

    it('should throw NotFoundException if doctor not found', async () => {
      doctorRepository.findById.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete doctor successfully', async () => {
      doctorRepository.findById.mockResolvedValue({ id: '1' } as any);
      doctorRepository.delete.mockResolvedValue(true);

      const result = await service.delete('1');

      expect(doctorRepository.findById).toHaveBeenCalledWith('1');
      expect(doctorRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        success: true,
        message: 'Success delete doctor',
      });
    });

    it('should throw NotFoundException if doctor not found', async () => {
      doctorRepository.findById.mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
});
