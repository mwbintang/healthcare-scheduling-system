import { Injectable, NotFoundException } from "@nestjs/common";
import { DoctorRepository } from "../repository/postgres/doctor.repository";
import { DoctorInput } from "./dto/doctor.input";
import { Doctor, DoctorDetail, DoctorPagination } from "./entities/doctor.entity";
import { DeleteResponse } from "../common/dto/delete-response.entity";

@Injectable()
export class DoctorService {
  constructor(
    private readonly doctorRepository: DoctorRepository,
  ) { }

  create(input: DoctorInput): Promise<Doctor> {
    return this.doctorRepository.create(input);
  }

  async update(id: string, input: DoctorInput): Promise<Doctor> {
    const existing = await this.doctorRepository.findById(id);
    if (!existing) {
      throw new NotFoundException("Doctor not found");
    }

    const updateDoctor = await this.doctorRepository.update(id, input);
    return this.doctorRepository.update(id, input);
  }

  async findAll(page = 1, limit = 10): Promise<DoctorPagination> {
    const skip = (page - 1) * limit;
    const { data, total } = await this.doctorRepository.findAll(skip, limit);

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<DoctorDetail> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    return doctor;
  }

  async delete(id: string): Promise<DeleteResponse> {
    const existing = await this.doctorRepository.findById(id);
    if (!existing) {
      throw new NotFoundException("Doctor not found");
    }

    const deleteDoctor = await this.doctorRepository.delete(id);

    return {
      success: deleteDoctor,
      message: `${deleteDoctor ? "Success" : "Failed"} delete doctor`
    };
  }
}