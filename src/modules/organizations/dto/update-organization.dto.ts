import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOrganizationDto {

    @IsOptional()
    name: string;

    @IsOptional()
    province: string
}
