import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupervisorsService } from './supervisors.service';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';

@Controller('supervisors')
export class SupervisorsController {
  constructor(private readonly supervisorsService: SupervisorsService) {}

  @Post()
  create(@Body() createSupervisorDto: CreateSupervisorDto) {
    return this.supervisorsService.create(createSupervisorDto);
  }

  @Get()
  findAll() {
    return this.supervisorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supervisorsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupervisorDto: UpdateSupervisorDto) {
    return this.supervisorsService.update(+id, updateSupervisorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supervisorsService.remove(+id);
  }
}
