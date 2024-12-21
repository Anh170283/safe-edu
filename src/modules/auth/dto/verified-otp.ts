import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class VerifiedOTPDto {
    @ApiProperty({
        description: 'OTP người dùng nhập vào',
      })
    @IsNotEmpty()
    otp: string;
}