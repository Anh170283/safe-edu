import { Injectable } from '@nestjs/common';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { UpdateSupervisorDto } from './dto/update-supervisor.dto';

@Injectable()
export class SupervisorsService {
	create(createSupervisorDto: CreateSupervisorDto) {
		return 'This action adds a new supervisor';
	}

	findAll() {
		return `This action returns all supervisors`;
	}

	findOne(id: string) {
		return `This action returns a #${id} supervisor`;
	}

	update(id: number, updateSupervisorDto: UpdateSupervisorDto) {
		return `This action updates a #${id} supervisor`;
	}

	remove(id: number) {
		return `This action removes a #${id} supervisor`;
	}
}
