import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { database_config } from './configs/configuration.config';

import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './exception-filters/global-exception.filter';
import * as mongoose from 'mongoose';
import { TopicsModule } from '@modules/topic/topic.module';

import { OrganizationsModule } from '@modules/organizations/organizations.module';
import { NewsModule } from '@modules/news/news.module';
import { AdminModule } from '@modules/admin/admin.module';
import { CategoriesModule } from '@modules/category/category.module';
import { StudentsModule } from '@modules/students/students.module';
import { CitizensModule } from '@modules/citizens/citizens.module';
import { ArticlesModule } from '@modules/articles/articles.module';
import { CompetitionsModule } from '@modules/competitions/competitions.module';
import { ManagerModule } from '@modules/manager/manager.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { RegistrationWithCitizenModule } from '@modules/registration-with-citizen/registration-with-citizen.module';
import { RegistrationWithStudentModule } from '@modules/registration-with-student/registration-with-student.module';
import { SupervisorsModule } from '@modules/supervisors/supervisors.module';
import { SupervisorsOrganizationsModule } from '@modules/supervisors-organizations/supervisors-organizations.module';
import { UserAchievementsModule } from '@modules/user-achievements/user-achievements.module';
import { AuthModule } from '@modules/auth/auth.module';
import { BinaryCloudModule } from '@modules/binary-cloud/binary-cloud.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision')
					.default('development'),
				PORT: Joi.number().port().required(),
				DATABASE_PORT: Joi.number().port().optional(),
				DATABASE_USERNAME: Joi.string().min(4).required(),
				DATABASE_PASSWORD: Joi.string().min(4).required(),
				DATABASE_HOST: Joi.string().required(),
				DATABASE_URI: Joi.string().required(),
			}),
			validationOptions: {
				abortEarly: false,
			},
			load: [database_config],
			isGlobal: true,
			cache: true,
			expandVariables: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				const uri = configService.get<string>('DATABASE_URI');
				const dbName = configService.get<string>('DATABASE_NAME');
				// Log MongoDB queries
				mongoose.set('debug', true);
				return {
					uri,
					dbName,
				};
			},
			inject: [ConfigService],
		}),
		OrganizationsModule,
		NewsModule,
		TopicsModule,
		CategoriesModule,
		AdminModule,
		StudentsModule,
		CitizensModule,
		ArticlesModule,
		CategoriesModule,
		CompetitionsModule,
		ManagerModule,
		NotificationsModule,
		RegistrationWithCitizenModule,
		RegistrationWithStudentModule,
		SupervisorsModule,
		SupervisorsOrganizationsModule,
		UserAchievementsModule,
		AuthModule,
		BinaryCloudModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionFilter,
		},
	],
})
export class AppModule {}
