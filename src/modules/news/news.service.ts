import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewDto } from './dto/create-new.dto';
import { UpdateNewDto } from './dto/update-new.dto';
import { NewsRepository } from '@repositories/news.repository';
import { News } from './entities/news.entity';
import mongoose from 'mongoose';
import { AwsS3Service } from 'src/services/aws-s3.service';
import { TopicsRepository } from '@repositories/topic.repository';
import { TopicsService } from '@modules/topic/topic.service';

@Injectable()
export class NewService {
  constructor(
    @Inject('NewsRepositoryInterface')
    private readonly news_repository: NewsRepository,
    private readonly awsS3Service: AwsS3Service,
    private readonly topic_service: TopicsService
  ) {}

  async create(createNewDto: CreateNewDto){
    try {
      // const category = await this.topic_service.findOne(createNewDto.category_id);

      // if(category) {
      //   const news = await this.news_repository.create({
      //     ...createNewDto,
      //     // category_id: category.id.toString()
      //   })
        // return news;
      }
    catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.news_repository.findAll();
  }

  async findOneById(id: string) {
    //check id
    if (mongoose.isValidObjectId(id)) {
      return await this.news_repository.findById(id);
    } else {
      throw new BadRequestException("Invalid id");
    }
  }

  async update(id: string, 
    updateNewDto: UpdateNewDto
  ): Promise<News> {
    const updatedNews = await this.findOneById(id);

    let imageUrl = updateNewDto.imageUrl || updatedNews.image_Url;

    // Handle image upload if a new file is provided
    if (typeof updateNewDto.imageUrl !== 'string' && updateNewDto.imageUrl) {
      imageUrl = await this.awsS3Service.uploadImage(updateNewDto.imageUrl);
    }

    const updatedNewsData = await this.news_repository.update(id, {...updateNewDto})
    if(!updatedNewsData) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return updatedNewsData;
  }

  async remove(id: string) {
    //check id 
    if (mongoose.isValidObjectId(id)) {
      return await this.news_repository.remove(id);
    } else {
      throw new BadRequestException("Invalid Id")
    }
  }
}
