import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Organization } from './entities/organization.entity';

@Controller('organizations')
@ApiTags('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  async create(@Body() createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    return await this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrive all organizations'})
  async findAll() {
    return await this.organizationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrive a organization by id'})
  findOne(@Param('id') id: string): Promise<Organization> {
    return this.organizationsService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a organization by ID' })
  async update(
    @Param('id') id: string, 
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ): Promise<Organization> {
    return await this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a organization by ID' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.organizationsService.remove(id);
  }

  @Get('active')
  @ApiOperation({ summary: 'Retrive all organizations is active'})
  async findAllIsActive() {
    return await this.organizationsService.findAllIsActive();
  }
}
