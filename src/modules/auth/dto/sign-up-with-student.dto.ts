import { IsEmail, IsNotEmpty, IsOptional, IsStrongPassword, MaxLength } from "class-validator";

export class SignUpWithStudentDto {
    @IsNotEmpty({ message: 'Tên học sinh không được để trống'})
    @MaxLength(50)
    first_name: string;

    @IsNotEmpty({ message: 'Tên học sinh không được để trống'})
    @MaxLength(50)
    last_name: string;

    @IsNotEmpty({ message: 'Số điện thoại không được để trống'})
    @MaxLength(50)
    phone_number: string;

    @IsNotEmpty({ message: 'Ngày sinh không được để trống'})
    date_of_birth?: Date;

    @IsNotEmpty({ message: 'Trường không được để trống'})
    organizationId: string;
}