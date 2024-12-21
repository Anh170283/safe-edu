import { IsNotEmpty, IsOptional } from "class-validator";
import mongoose from "mongoose";

export class CreateNewDto {
	@IsNotEmpty()
	category_id?: mongoose.Schema.Types.ObjectId;
  
    @IsNotEmpty()
	title: string;

    @IsNotEmpty()
	content: string;
    
	@IsOptional()
	imageUrl: string;

    @IsNotEmpty()
	author: string;

}
