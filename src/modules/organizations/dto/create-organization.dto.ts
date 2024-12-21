import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateOrganizationDto {

    @IsNotEmpty({ message: 'Tên trường không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Tên tỉnh thành không được để trống' })
    province: string
}
