import { PartialType } from '@nestjs/mapped-types';
import { CreateSupervisorsOrganizationDto } from './create-supervisors-organization.dto';

export class UpdateSupervisorsOrganizationDto extends PartialType(CreateSupervisorsOrganizationDto) {}
