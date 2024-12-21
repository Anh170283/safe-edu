import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Request,
} from '@nestjs/common';
import { CitizensService } from './citizens.service';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Citizen } from './entities/citizen.entity';
import { RolesEnum } from 'src/enums/roles..enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('Citizens')
@ApiTags('Citizens')
@ApiBearerAuth('token')
@UseGuards(JwtAccessTokenGuard, RolesGuard)
export class CitizensController {
	constructor(private readonly CitizensService: CitizensService) {}

	@Post()
	@Roles(RolesEnum.CITIZEN)
	@ApiOperation({ summary: 'Create a new Citizen' })
	async create(
		@Body() createCitizenDto: CreateCitizenDto,
		@Request() req,
	): Promise<Citizen> {
		console.log(req.user);
		return await this.CitizensService.create(createCitizenDto);
	}

	@Get()
	@Roles(RolesEnum.CITIZEN)
	@ApiOperation({ summary: 'Retrieve all Citizens' })
	async findAll(@Request() req): Promise<Citizen[]> {
		const userId = req.user.userId;
		console.log('=======>UserId', userId);
		return await this.CitizensService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Retrieve a user by ID' })
	async findOne(@Param('id') _id: string, action: string): Promise<Citizen> {
		return await this.CitizensService.findOneByCondition({ _id }, action);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update a Citizen by ID' })
	async update(
		@Param('id') id: string,
		@Body() updateCitizenDto: UpdateCitizenDto,
	): Promise<Citizen> {
		return await this.CitizensService.update(id, updateCitizenDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a Citizen by ID' })
	async remove(@Param('id') id: string): Promise<void> {
		await this.CitizensService.remove(id);
	}

	@Get(':phone_number')
	@ApiOperation({ summary: 'Retrieve a user by phone_number' })
	async findOneByPhoneNumber(
		@Param('phone_number') phone_number: string,
		action: string,
	): Promise<Citizen> {
		return await this.CitizensService.findOneByCondition(
			{ phone_number },
			action,
		);
	}
}
