import { Student } from '@modules/students/entities/student.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
	BadRequestException,
	ConflictException,
	ConsoleLogger,
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { StudentsService } from '@modules/students/students.service';

// INNER
import { SignUpDto, SignUpGoogleDto } from './dto/sign-up.dto';

// OUTER
import { TokenPayload } from './interfaces/token.interface';
import {
	access_token_private_key,
	refresh_token_private_key,
} from 'src/constraints/jwt.constraint';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { SignUpWithStudentDto } from './dto/sign-up-with-student.dto';
import { AdminService } from '@modules/admin/admin.service';
import { SignUpWithCitizenDto } from './dto/sign-up-with-citizen.dto';
import { RolesEnum } from 'src/enums/roles..enum';
import { CitizensService } from '@modules/citizens/citizens.service';
import { Citizen } from '@modules/citizens/entities/citizen.entity';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class AuthService {
	private SALT_ROUND = 11;
	constructor(
		private config_service: ConfigService,
		private readonly admin_service: AdminService,
		private readonly student_service: StudentsService,
		private readonly citizen_service: CitizensService,
		private readonly jwt_service: JwtService,
		private readonly mailer_service: MailerService,
	) {}

	generateAccessToken(payload: TokenPayload) {
		return this.jwt_service.sign(payload, {
			algorithm: 'RS256',
			privateKey: access_token_private_key,
			expiresIn: `${this.config_service.get<string>(
				'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
			)}s`,
		});
	}

	generateRefreshToken(payload: TokenPayload) {
		return this.jwt_service.sign(payload, {
			algorithm: 'RS256',
			privateKey: refresh_token_private_key,
			expiresIn: `${this.config_service.get<string>(
				'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
			)}s`,
		});
	}

	// async getUserIfRefreshTokenMatched(
	// 	user_id: string,
	// 	refresh_token: string,
	// ): Promise<User> {
	// 	try {
	// 		const user = await this.users_service.findOneByCondition({
	// 			_id: user_id,
	// 		});
	// 		if (!user) {
	// 			throw new UnauthorizedException({
	// 				message: ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION,
	// 				details: 'Unauthorized',
	// 			});
	// 		}
	// 		await this.verifyPlainContentWithHashedContent(
	// 			refresh_token,
	// 			user.current_refresh_token,
	// 		);
	// 		return user;
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }


	async storeRefreshTokenForStudent(_id: string, token: string): Promise<void> {
		try {
			const hashed_token = await bcrypt.hash(token, this.SALT_ROUND);
			await this.student_service.setCurrentRefreshToken(_id, hashed_token);
		} catch (error) {
			throw error;
		}
	}

	async storeRefreshTokenForCitizen(_id: string, token: string): Promise<void> {
		try {
			const hashed_token = await bcrypt.hash(token, this.SALT_ROUND);
			await this.citizen_service.setCurrentRefreshToken(_id, hashed_token);
		} catch (error) {
			throw error;
		}
	}

	async signIn(_id: string) {
		try {
			const [student, citizen] = await Promise.all([
				await this.student_service.findOneByCondition({ _id }, 'sign-in'),
				await this.citizen_service.findOneByCondition({ _id }, 'sign-in')
			]);

			if (student) {
				console.log("hello" + student)
				const access_token = this.generateAccessToken({
					userId: student._id.toString(),
					role: 'Student',
				});
				const refresh_token = this.generateRefreshToken({
					userId: student._id.toString(),
					role: 'Student',
				});
				await this.storeRefreshTokenForStudent(_id, refresh_token);
				return {
					access_token,
					refresh_token,
				};
			} else if (citizen) {
				const access_token = this.generateAccessToken({
					userId: citizen._id.toString(),
					role: 'Citizen',
				});
				const refresh_token = this.generateRefreshToken({
					userId: citizen._id.toString(),
					role: 'Citizen',
				});
				await this.storeRefreshTokenForStudent(_id, refresh_token);
				return {
					access_token,
					refresh_token,
				};
			} else {
				throw new BadRequestException({
					message: ERRORS_DICTIONARY.USER_NOT_FOUND,
					details: 'User not found!!',
				});
			}
		} catch (error) {
			throw error
		}
	}

	async signUpWithStudent(sign_up_with_std_dto: SignUpWithStudentDto) {
		try {
			const { first_name, last_name, phone_number, organizationId } =
				sign_up_with_std_dto;

			const [existed_student_phone_number, existed_citizen_phone_number] = await Promise.all([
				await this.student_service.findOneByCondition({ phone_number: sign_up_with_std_dto.phone_number }, 'sign-up'),
				await this.citizen_service.findOneByCondition({ phone_number: sign_up_with_std_dto.phone_number }, 'sign-up')
			]);

			if (existed_student_phone_number) {
				throw new BadRequestException({
					message: ERRORS_DICTIONARY.CITIZEN_PHONE_NUMBER_EXISTS,
					details: 'Phone number already exist',
				});
			}

			if (existed_citizen_phone_number) {
				throw new BadRequestException({
					message: ERRORS_DICTIONARY.CITIZEN_PHONE_NUMBER_EXISTS,
					details: 'Phone number already exist',
				});
			}
			
			const student = await this.student_service.create({
				first_name,
				last_name,
				phone_number,
				organizationId,
			});

			const refresh_token = this.generateRefreshToken({
				userId: student._id.toString(),
				role: 'Student',
			});
			try {
				await this.storeRefreshTokenForStudent(student._id.toString(), refresh_token);
				return {
					access_token: this.generateAccessToken({
						userId: student._id.toString(),
						role: 'Student',
					}),
					refresh_token,
				};
		} catch (error) {
			console.error(
				'Error storing refresh token or generating access token:',
				error,
			);
			throw new Error(
				'An error occurred while processing tokens. Please try again.',
			);
		}
		} catch(error) {
			throw error;
		}	
	}

	async signUpWithCitizen(sign_up_with_citizen_dto: SignUpWithCitizenDto) {
		try {
			const { first_name, last_name, phone_number } =
			sign_up_with_citizen_dto;
			const [existed_student_phone_number, existed_citizen_phone_number] = await Promise.all([
				await this.student_service.findOneByCondition({ phone_number: sign_up_with_citizen_dto.phone_number }, 'sign-up'),
				await this.citizen_service.findOneByCondition({ phone_number: sign_up_with_citizen_dto.phone_number }, 'sign-up')
			]);
			
			console.log(existed_citizen_phone_number, existed_student_phone_number)

			if (existed_student_phone_number) {
				throw new BadRequestException({
					message: ERRORS_DICTIONARY.CITIZEN_PHONE_NUMBER_EXISTS,
					details: 'Phone number already exist',
				});
			}

			if (existed_citizen_phone_number) {
				throw new BadRequestException({
					message: ERRORS_DICTIONARY.CITIZEN_PHONE_NUMBER_EXISTS,
					details: 'Phone number already exist',
				});
			}

			const citizen = await this.citizen_service.create({
				first_name,
				last_name,
				phone_number,
			});

			const refresh_token = this.generateRefreshToken({
				userId: citizen._id.toString(),
				role: 'Citizen',
			});
			try {
				await this.citizen_service.setCurrentRefreshToken(citizen._id.toString(), refresh_token);
				return {
					access_token: this.generateAccessToken({
						userId: citizen._id.toString(),
						role: 'Citizen',
					}),
					refresh_token,
				};
		} catch (error) {
			console.error(
				'Error storing refresh token or generating access token:',
				error,
			);
			throw new Error(
				'An error occurred while processing tokens. Please try again.',
			);
		}
	}
	catch(error) {
		throw error;
	}
	}

	async verifyOTP(otp: string) {
		if (otp == "000000") {
			return { 
				success: true, 
				message: "OTP Verified Successfully"
			}
		} else {
			throw new HttpException(
				{
				  status: "error",
				  message: "Invalid OTP",
				},
				HttpStatus.BAD_REQUEST, 
			);
		}
	}

	sendMail(): void{
		this.mailer_service.sendMail({
			to: 'monkeyold113@gmail.com' ,
			from: 'baopqtde181053@fpt.edu.vn',
			subject: 'Verify email',
			text: 'hello',
			html: '<b>Welcome to Safe Edu</b>'
		})
	}

	async authInWithGoogle(sign_up_dto: SignUpGoogleDto) {
		console.log('auth');
		
		try {
			let admin = await this.admin_service.findOneByCondition({
				email: sign_up_dto.email,
			});
			// kiem tra neu admin da co duoc dang ky trong db
			if (admin) {
			
				return await this.signInAdmin(admin._id.toString());
			}
			// 🔎 Từ bước này trở xuống sẽ tương tự với method signUp đã có
			// 🟢 Mọi người có thể refactor lại để tránh lặp code nếu muốn
			
		} catch (error) {
			throw error;
		}
	}

	async signInAdmin(_id:string){
		const admin =await this.admin_service.findOneByCondition({ _id })
		if(admin)
			{
				console.log("hello" + admin)
				const access_token = this.generateAccessToken({
					userId: admin._id.toString(),
					role: 'Admin',
				});
				const refresh_token = this.generateRefreshToken({
					userId: admin._id.toString(),
					role: 'admin',
				});
				
				return {
					access_token,
					refresh_token,
				};
			} 
	}
}
