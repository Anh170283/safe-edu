import { OmitType, PartialType } from '@nestjs/swagger';
import {
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	MaxLength,
} from 'class-validator';

import { CreateAdminDto } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(
	OmitType(CreateAdminDto, ['email', 'password'] as const),
) {
	@IsOptional()
	@IsPhoneNumber()
	phone_number?: string;

	@IsOptional()
	@IsDateString()
	date_of_birth?: Date;

	@IsOptional()
	@MaxLength(200)
	headline?: string;


}
