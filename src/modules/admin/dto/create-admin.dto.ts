import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  IsDefined,
  Matches,
} from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  first_name: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  last_name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(50, { message: 'Email cannot exceed 50 characters' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsOptional()
  @IsPhoneNumber('VN', { message: 'Invalid phone number format for Vietnam' })
  phone_number?: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({}, { message: 'Password must be strong (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol)' })
  password: string;
}
