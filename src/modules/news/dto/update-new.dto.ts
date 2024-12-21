import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateNewDto {
    @IsOptional()
	topic_id: string;
  
    @IsOptional()
	title: string;

    @IsOptional()
	content: string;
    
    @IsOptional()
	imageUrl: string;

    @IsOptional()
	author: string;
}
