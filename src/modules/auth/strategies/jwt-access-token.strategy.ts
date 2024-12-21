import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../interfaces/token.interface';
import { access_token_public_key } from 'src/constraints/jwt.constraint';

import { AdminService } from '@modules/admin/admin.service';
import { StudentsService } from '@modules/students/students.service';
import { CitizensService } from '@modules/citizens/citizens.service';

import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private readonly adminService: AdminService,
		private readonly studentService: StudentsService,
		private readonly citizenService: CitizensService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: access_token_public_key,
		});
	}

	async validate(payload: TokenPayload) {
		const { userId, role } = payload;

		switch (role) {
			case 'Citizen':
				const citizen = await this.citizenService.findOne(userId);
				if (!citizen) {
					throw new UnauthorizedException('Access Denied: Citizen not found.');
				}
				break;
			case 'Student':
				const student = await this.studentService.findOne(userId);
				if (!student) {
					throw new UnauthorizedException('Access Denied: Student not found.');
				}
				break;

			default:
				throw new UnauthorizedException('Access Denied: Invalid role.');
		}

		return payload;
	}
}
