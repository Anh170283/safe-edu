import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// INNER

// OUTER
import { OrganizationsService } from '@modules/organizations/organizations.service';
import { OrganizationsRepository } from '@repositories/organizations.repository';
import { OrganizationsModule } from '@modules/organizations/organizations.module';
import { Citizen, CitizenSchemaFactory } from './entities/citizen.entity';
import { CitizensController } from './citizens.controller';
import { CitizensService } from './citizens.service';
import { CitizensRepository } from '@repositories/citizen.repository';
import { AuthService } from '@modules/auth/auth.service';
import { StudentsModule } from '@modules/students/students.module';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Citizen.name,
				useFactory: CitizenSchemaFactory,
				inject: [],
				imports: [MongooseModule.forFeature([])],
			},
		]),
		OrganizationsModule,
		forwardRef(() => StudentsModule),
	],
	controllers: [CitizensController],
	providers: [
		CitizensService,
		{ provide: 'CitizensRepositoryInterface', useClass: CitizensRepository },
	],
	exports: [CitizensService, 'CitizensRepositoryInterface'],
})
export class CitizensModule {}
