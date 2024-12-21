import { Module } from '@nestjs/common';
import { RegistrationWithCitizenService } from './registration-with-citizen.service';
import { RegistrationWithCitizenController } from './registration-with-citizen.controller';

@Module({
  controllers: [RegistrationWithCitizenController],
  providers: [RegistrationWithCitizenService],
})
export class RegistrationWithCitizenModule {}
