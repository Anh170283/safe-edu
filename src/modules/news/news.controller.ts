import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { NewService } from './news.service';
import { CreateNewDto } from './dto/create-new.dto';
import { UpdateNewDto } from './dto/update-new.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { IFile } from 'src/interfaces/file.interface';
import { AwsS3Service } from 'src/services/aws-s3.service';

@Controller('news')
@ApiTags('news')
export class NewController {
  constructor(
    private readonly newsService: NewService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() image: IFile,
    @Body() {category_id, title, content, author}: CreateNewDto,
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

      // Upload the image to AWS S3
      const uploadResult = await this.awsS3Service.uploadImage(image);

      console.log('Image uploaded:', uploadResult);

      // Construct the DTO with the image URL from AWS S3
      const createNewsDto: CreateNewDto = {
        category_id,
        title,
        content,
        author,
        imageUrl: uploadResult, // Assuming `Location` contains the uploaded image URL
      };

      // Call the service to create the category
      const createdNews = await this.newsService.create(createNewsDto);

      return {
        statusCode: HttpStatus.OK,
        message: 'News created successfully',
        success: true,
        data: createdNews,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'News creation failed',
          success: false,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrive all news'})
  async findAll() {
    return await this.newsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrive a news by id'})
  findOneById(@Param('id') id: string) {
    return this.newsService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a news by ID' })
  update(@Param('id') id: string, @Body() updateNewDto: UpdateNewDto) {
    return this.newsService.update(id, updateNewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a news by ID' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
