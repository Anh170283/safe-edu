import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import { CategoriesController } from './category.controller';
import { Category, CategorySchemaFactory } from './entities/category.entity';
import { CategoriesRepository } from 'src/repositories/category.repository';
import { AwsS3Service } from 'src/services/aws-s3.service';
import { GeneratorService } from 'src/services/generator.service';
// Removed the interface import here

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Category.name,
        useFactory: CategorySchemaFactory,
      },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoryService,
    AwsS3Service,
    GeneratorService,
    { provide: 'CategoriesRepositoryInterface', useClass: CategoriesRepository },
  ],
  exports: [AwsS3Service],
})
export class CategoriesModule {}
