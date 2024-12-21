import { IsNotEmpty, IsStrongPassword, MaxLength } from "class-validator";

export class CreateCitizenDto {
        @IsNotEmpty({ message: 'Tên người dân không được để trống'})
        @MaxLength(50)
        first_name: string;
    
        @IsNotEmpty({ message: 'Tên người dân không được để trống'})
        @MaxLength(50)
        last_name: string;

        @IsNotEmpty({ message: 'Ngày sinh không được để trống'})
        date_of_birth?: Date;
    
        @IsNotEmpty({ message: 'Số điện thoại không được để trống'})
        @MaxLength(50)
        phone_number: string;

}
