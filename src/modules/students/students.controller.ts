import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Student } from './entities/student.entity';

@Controller('students')
@ApiTags('students')
@ApiBearerAuth('token')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all students' })
  async findAll() {
    return await this.studentsService.findAll();
  }

  @Get(':id')
	@ApiOperation({ summary: 'Retrieve a user by ID' })
	async findOne(@Param('id') _id: string, action: string): Promise<Student> {
  return await this.studentsService.findOneByCondition({ _id }, action);
	}

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student by ID' })
  async update(
		@Param('id') id: string,
		@Body() updateStudentDto: UpdateStudentDto,
	): Promise<Student> {
		return await this.studentsService.update(id, updateStudentDto);
	}

  @Delete(':id')
	@ApiOperation({ summary: 'Delete a student by ID' })
	async remove(@Param('id') id: string): Promise<void> {
		await this.studentsService.remove(id);
	} 

  @Get('phone/:phone_number')
	@ApiOperation({ summary: 'Retrieve a user by phone_number' })
	async findOneByPhoneNumber(@Param('phone_number') phone_number: string, action: string): Promise<Student> {
    console.log(phone_number);
		return await this.studentsService.findOneByCondition({ phone_number }, action);
	}

}
