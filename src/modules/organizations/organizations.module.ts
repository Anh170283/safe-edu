import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchemaFactory, OrganizationsSchema } from './entities/organization.entity';
import { OrganizationsRepository } from '@repositories/organizations.repository';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
      {
        name: Organization.name,
        useFactory: OrganizationSchemaFactory,
				inject: [],
				imports: [MongooseModule.forFeature([])],
      }
    ])
	],
	controllers: [OrganizationsController],
	providers: [
		OrganizationsService,
		{ provide: 'OrganizationsRepositoryInterface', useClass: OrganizationsRepository },
	],
	exports: [OrganizationsService],
})
export class OrganizationsModule {}
