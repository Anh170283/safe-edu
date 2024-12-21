import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupervisorsOrganizationsService } from './supervisors-organizations.service';
import { CreateSupervisorsOrganizationDto } from './dto/create-supervisors-organization.dto';
import { UpdateSupervisorsOrganizationDto } from './dto/update-supervisors-organization.dto';

@Controller('supervisors-organizations')
export class SupervisorsOrganizationsController {
  constructor(private readonly supervisorsOrganizationsService: SupervisorsOrganizationsService) {}

  @Post()
  create(@Body() createSupervisorsOrganizationDto: CreateSupervisorsOrganizationDto) {
    return this.supervisorsOrganizationsService.create(createSupervisorsOrganizationDto);
  }

  @Get()
  findAll() {
    return this.supervisorsOrganizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supervisorsOrganizationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupervisorsOrganizationDto: UpdateSupervisorsOrganizationDto) {
    return this.supervisorsOrganizationsService.update(+id, updateSupervisorsOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supervisorsOrganizationsService.remove(+id);
  }
}
