import { Injectable } from '@nestjs/common';
import { CreateSupervisorsOrganizationDto } from './dto/create-supervisors-organization.dto';
import { UpdateSupervisorsOrganizationDto } from './dto/update-supervisors-organization.dto';

@Injectable()
export class SupervisorsOrganizationsService {
  create(createSupervisorsOrganizationDto: CreateSupervisorsOrganizationDto) {
    return 'This action adds a new supervisorsOrganization';
  }

  findAll() {
    return `This action returns all supervisorsOrganizations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supervisorsOrganization`;
  }

  update(id: number, updateSupervisorsOrganizationDto: UpdateSupervisorsOrganizationDto) {
    return `This action updates a #${id} supervisorsOrganization`;
  }

  remove(id: number) {
    return `This action removes a #${id} supervisorsOrganization`;
  }
}
