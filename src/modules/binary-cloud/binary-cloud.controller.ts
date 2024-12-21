import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	HttpException,
	HttpStatus,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IFile } from 'src/interfaces/file.interface';
import { CloudinaryService } from 'src/services/binary-cloud.service';

@Controller('binary-cloud')
export class BinaryCloudController {
	constructor(private readonly cloudinaryService: CloudinaryService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadImage(@UploadedFile() file: IFile) {
		try {
			if (!file || !file.buffer) {
				throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
			}

			const result = await this.cloudinaryService.uploadFile(file, 'uploads');

			return {
				statusCode: HttpStatus.OK,
				message: 'Image uploaded successfully',
				success: true,
				data: result,
			};
		} catch (error) {
			throw new HttpException(
				{
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
					message: 'Failed to upload image',
					success: false,
					error: error.message,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get('signed-url/:key')
	async getSignedUrl(@Param('key') key: string) {
		try {
			const url = await this.cloudinaryService.getDownloadLink(key);
			return { statusCode: HttpStatus.OK, url };
		} catch (error) {
			throw new HttpException(
				{
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
					message: 'Failed to generate signed URL',
					error: error.message,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Delete('delete/:key')
	async deleteObject(@Param('key') key: string) {
		try {
			await this.cloudinaryService.deleteFile(key);
			return {
				statusCode: HttpStatus.OK,
				message: 'File deleted successfully',
			};
		} catch (error) {
			throw new HttpException(
				{
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
					message: 'Failed to delete file',
					error: error.message,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Delete('delete-multiple')
	async deleteObjects(@Body('keys') keys: string[]) {
		try {
			if (!keys || keys.length === 0) {
				throw new HttpException('No keys provided', HttpStatus.BAD_REQUEST);
			}

			await this.cloudinaryService.deleteMultipleFiles(keys);
			return {
				statusCode: HttpStatus.OK,
				message: 'Files deleted successfully',
			};
		} catch (error) {
			throw new HttpException(
				{
					statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
					message: 'Failed to delete files',
					error: error.message,
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
