import { Injectable } from '@nestjs/common';
import { CreateRegistrationWithStudentDto } from './dto/create-registration-with-student.dto';
import { UpdateRegistrationWithStudentDto } from './dto/update-registration-with-student.dto';

@Injectable()
export class RegistrationWithStudentService {
  create(createRegistrationWithStudentDto: CreateRegistrationWithStudentDto) {
    return 'This action adds a new registrationWithStudent';
  }

  findAll() {
    return `This action returns all registrationWithStudent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} registrationWithStudent`;
  }

  update(id: number, updateRegistrationWithStudentDto: UpdateRegistrationWithStudentDto) {
    return `This action updates a #${id} registrationWithStudent`;
  }

  remove(id: number) {
    return `This action removes a #${id} registrationWithStudent`;
  }
}
