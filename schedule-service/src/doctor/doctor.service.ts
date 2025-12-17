import { Injectable, NotFoundException } from "@nestjs/common";
import { DoctorRepository } from "../repository/postgres/doctor.repository";

@Injectable()
export class DoctorService {
  constructor(
    private readonly doctorRepository: DoctorRepository,
  ) {}

  create(input) {
    return this.doctorRepository.create(input);
  }

  async update(id: string, input) {
    const existing = await this.doctorRepository.findById(id);
    if (!existing) {
      throw new NotFoundException("Doctor not found");
    }

    return this.doctorRepository.update(id, input);
  }

  findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.doctorRepository.findAll(skip, limit);
  }

  async findById(id: string) {
    const Doctor = await this.doctorRepository.findById(id);
    if (!Doctor) {
      throw new NotFoundException("Doctor not found");
    }
    return Doctor;
  }

  async delete(id: string) {
    const existing = await this.doctorRepository.findById(id);
    if (!existing) {
      throw new NotFoundException("Doctor not found");
    }

    await this.doctorRepository.delete(id);
    return true;
  }
}
