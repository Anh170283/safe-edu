// src/modules/categories/categories.controller.ts

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
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IFile } from 'src/interfaces/file.interface';
import { AwsS3Service } from 'src/services/aws-s3.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() image: IFile,
    @Body() {category_name,topic_id, description }: CreateCategoryDto,
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
      const createCategoryDto: CreateCategoryDto = {
        category_name,
        topic_id,
        description,
        image: uploadResult, // Assuming `Location` contains the uploaded image URL
      };

      // Call the service to create the category
      const createdCategory = await this.categoryService.create(createCategoryDto);

      return {
        statusCode: HttpStatus.OK,
        message: 'Category created successfully',
        success: true,
        data: createdCategory,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Category creation failed',
          success: false,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
