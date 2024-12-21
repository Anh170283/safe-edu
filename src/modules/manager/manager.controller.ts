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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose-class-serializer.interceptor';

// Inner imports

// Outer imports
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { Roles } from 'src/decorators/roles.decorator';

import { Manager } from './entities/manager.entity';

import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { RolesEnum } from 'src/enums/roles..enum';

@Controller('Manager')
@ApiTags('Manager')
@UseInterceptors(MongooseClassSerializerInterceptor(Manager))
@ApiBearerAuth('token')
@Roles(RolesEnum.ADMIN)
export class ManagerController {
	constructor(private readonly ManagerService: ManagerService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new Manager' })
	async create(@Body() createManagerDto: CreateManagerDto): Promise<Manager> {
		console.log('controller');
		return await this.ManagerService.create(createManagerDto);
	}

	@Get()
	async findAll() {
		return await this.ManagerService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Retrieve a Manager by ID' })
	async findOne(@Param('id') id: string): Promise<Manager> {
		return await this.ManagerService.findOneByCondition({ id });
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update a Manager by ID' })
	async update(
		@Param('id') id: string,
		@Body() updateManagerDto: UpdateManagerDto,
	): Promise<Manager> {
		return await this.ManagerService.update(id, updateManagerDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a user by ID' })
	@UseGuards(JwtAccessTokenGuard)
	async remove(@Param('id') id: string): Promise<void> {
		await this.ManagerService.remove(id);
	}
}
