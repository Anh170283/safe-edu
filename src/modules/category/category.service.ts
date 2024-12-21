import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { AwsS3Service } from 'src/services/aws-s3.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepositoryInterface } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CategoriesRepositoryInterface')
    private readonly categoriesRepository: CategoriesRepositoryInterface,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async create(createDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.create(createDto);
  }

  async update(
    id: string,
    updateDto: UpdateCategoryDto,
  ): Promise<Category> {
    const existingCategory = await this.findOne(id);

    let imageUrl = updateDto.image || existingCategory.image_url;

    // Handle image upload if a new file is provided
    if (typeof updateDto.image !== 'string' && updateDto.image) {
      imageUrl = await this.awsS3Service.uploadImage(updateDto.image);
    }

    const updatedCategoryData = {
      ...updateDto,
      image: imageUrl,
    };

    return this.categoriesRepository.update(id, updatedCategoryData);
  }

  async findAll() {
    return this.categoriesRepository.findAll();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOneByCondition({
      _id: id,
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async delete(id: string): Promise<Category> {
    return await this.categoriesRepository.update(id, {
      deleted_at: new Date(),
    });
  }
}
