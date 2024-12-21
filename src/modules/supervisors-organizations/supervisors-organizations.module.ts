import { Module } from '@nestjs/common';
import { SupervisorsOrganizationsService } from './supervisors-organizations.service';
import { SupervisorsOrganizationsController } from './supervisors-organizations.controller';

@Module({
  controllers: [SupervisorsOrganizationsController],
  providers: [SupervisorsOrganizationsService],
})
export class SupervisorsOrganizationsModule {}
