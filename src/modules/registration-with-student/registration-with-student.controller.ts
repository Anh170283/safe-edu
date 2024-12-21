import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistrationWithStudentService } from './registration-with-student.service';
import { CreateRegistrationWithStudentDto } from './dto/create-registration-with-student.dto';
import { UpdateRegistrationWithStudentDto } from './dto/update-registration-with-student.dto';

@Controller('registration-with-student')
export class RegistrationWithStudentController {
  constructor(private readonly registrationWithStudentService: RegistrationWithStudentService) {}

  @Post()
  create(@Body() createRegistrationWithStudentDto: CreateRegistrationWithStudentDto) {
    return this.registrationWithStudentService.create(createRegistrationWithStudentDto);
  }

  @Get()
  findAll() {
    return this.registrationWithStudentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registrationWithStudentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistrationWithStudentDto: UpdateRegistrationWithStudentDto) {
    return this.registrationWithStudentService.update(+id, updateRegistrationWithStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registrationWithStudentService.remove(+id);
  }
}
