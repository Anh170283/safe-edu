import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  HttpException, 
  HttpStatus, 
  Param, 
  Post, 
  Put, 
  UploadedFile, 
  UseGuards, 
  UseInterceptors 
} from '@nestjs/common';
import { TopicsService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IFile } from 'src/interfaces/file.interface';
import { AwsS3Service } from 'src/services/aws-s3.service';
import { Roles } from 'src/decorators/roles.decorator';
;
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';

import { Public } from 'src/decorators/auth.decorator';


@Controller('topics')
export class TopicsController {
  constructor(
    private readonly topicsService: TopicsService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  @Post()
  @Public()

	@UseGuards(JwtAccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() image: IFile,
    @Body() { topic_name, description }: CreateTopicDto,
  ) {
    try {
      if (!image) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'File is required',
            success: false,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const uploadResult = await this.awsS3Service.uploadImage(image);

      const createTopicDto: CreateTopicDto = {
        topic_name,
        description,
        image: uploadResult,
      };

      const createdTopic = await this.topicsService.create(createTopicDto);

      return {
        statusCode: HttpStatus.OK,
        message: 'Topic created successfully',
        success: true,
        data: createdTopic,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Topic creation failed',
          success: false,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @Public()
  
	@UseGuards(JwtAccessTokenGuard)
  async update(@Param('id') id: string, @Body() updateDto: UpdateTopicDto) {
    return this.topicsService.update(id, updateDto);
  }

  @Delete(':id')
  @Public()

	@UseGuards(JwtAccessTokenGuard)
  async delete(@Param('id') id: string) {
    return this.topicsService.delete(id);
  }


  @Get()
  @Public()

	@UseGuards(JwtAccessTokenGuard)
  async findAll() {
    return this.topicsService.findAll();
  }

  @Get(':id')
  @Get()
  @Public()

	@UseGuards(JwtAccessTokenGuard)
  async findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }
}
