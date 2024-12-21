import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UseGuards,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import {
	ApiTags,
	ApiBearerAuth,
	ApiOperation,
} from '@nestjs/swagger';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose-class-serializer.interceptor';

// Inner imports


// Outer imports
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';

import { Admin } from './entities/admin.entity';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
@ApiTags('admin')
@UseInterceptors(MongooseClassSerializerInterceptor(Admin))
@ApiBearerAuth('token')
export class AdminController {
	constructor(private readonly adminService: AdminService) { }

	@Post()
	@ApiOperation({ summary: 'Create a new admin' })
	async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
		try {
			// Validate required fields
			if (!createAdminDto.first_name || !createAdminDto.last_name || !createAdminDto.email || !createAdminDto.phone_number || !createAdminDto.password) {
				throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
			}

			// Check if an admin already exists with the same email or phone number
			const existingAdmin = await this.adminService.findOneByCondition({
				$or: [{ email: createAdminDto.email }, { phone_number: createAdminDto.phone_number }],
			});

			if (existingAdmin) {
				throw new HttpException('Admin with this email or phone number already exists', HttpStatus.BAD_REQUEST);
			}

			// Create new admin if validation passes and no existing admin is found
			return await this.adminService.create(createAdminDto);
		} catch (error) {
			// Handle error by throwing HttpException with message and status code
			throw new HttpException(
				{
					statusCode: HttpStatus.BAD_REQUEST,
					message: error.message || 'Something went wrong while creating the admin',
				},
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Get()
	async findAll() {
		return await this.adminService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Retrieve a admin by ID' })
	async findOne(@Param('id') _id: string): Promise<Admin> {
		console.log("controller:" + this.adminService.findOneById(_id));

		return await this.adminService.findOneByCondition({ _id });
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update a admin by ID' })
	async update(
		@Param('id') id: string,
		@Body() updateAdminDto: UpdateAdminDto,
	): Promise<Admin> {
		return await this.adminService.update(id, updateAdminDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a user by ID' })
	@UseGuards(JwtAccessTokenGuard)
	async remove(@Param('id') id: string): Promise<void> {
		await this.adminService.remove(id);
	}
}
