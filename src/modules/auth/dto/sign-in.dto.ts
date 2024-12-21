import { IsNotEmpty } from "class-validator";

export class SignInDto {
    @IsNotEmpty({ message: "Id không được để trống"})
    id: string;
}