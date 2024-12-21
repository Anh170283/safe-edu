import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsNotEmpty()
  @MaxLength(60) 
  category_name: string;
  
  @IsNotEmpty()
  topic_id: string;

  @IsOptional()
  @MaxLength(255) 
  description?: string;

  @IsOptional()
  image?:  string
}
