import { Category } from './../entities/category.entity';
import { IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateCategoryDto {
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
