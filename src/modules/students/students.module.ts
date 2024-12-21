import { StudentsRepository } from '@repositories/student.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// INNER

// OUTER
import { OrganizationsService } from '@modules/organizations/organizations.service';
import { OrganizationsRepository } from '@repositories/organizations.repository';
import { OrganizationsModule } from '@modules/organizations/organizations.module';
import { Student, StudentSchemaFactory } from './entities/student.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

import { AuthService } from '@modules/auth/auth.service';
import { CitizensModule } from '@modules/citizens/citizens.module';
import { CitizensService } from '@modules/citizens/citizens.service';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Student.name,
				useFactory: StudentSchemaFactory,
				inject: [],
				imports: [MongooseModule.forFeature([])],
			},
		]),
		OrganizationsModule,
		CitizensModule,
	],
	controllers: [StudentsController],
	providers: [
		StudentsService,
		{ provide: 'StudentsRepositoryInterface', useClass: StudentsRepository },
		CitizensService
	],
	exports: [StudentsService,
		'StudentsRepositoryInterface',
	],
})
export class StudentsModule {}
