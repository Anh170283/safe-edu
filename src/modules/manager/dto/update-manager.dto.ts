import { OmitType, PartialType } from '@nestjs/swagger';
import {
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	MaxLength,
} from 'class-validator';



import { CreateManagerDto } from './create-manager.dto';
import { Organization } from '@modules/organizations/entities/organization.entity';
import { GENDER } from '../entities/manager.entity';

export class UpdateManagerDto extends PartialType(
	OmitType(CreateManagerDto, ['email', 'password'] as const),
) {
	@IsOptional()
	@IsPhoneNumber()
	phone_number?: string;

	@IsOptional()
	@IsDateString()
	date_of_birth?: Date;

	@IsOptional()
	@IsEnum(GENDER)
	gender?: GENDER;

	@IsOptional()
	@MaxLength(200)
	headline?: string;

	@IsNotEmpty()
	organization: Organization;
}
