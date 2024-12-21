import { Module } from '@nestjs/common';
import { RegistrationWithStudentService } from './registration-with-student.service';
import { RegistrationWithStudentController } from './registration-with-student.controller';

@Module({
  controllers: [RegistrationWithStudentController],
  providers: [RegistrationWithStudentService],
})
export class RegistrationWithStudentModule {}
