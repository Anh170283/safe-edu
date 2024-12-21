import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import { PassThrough } from 'stream';
import * as archiver from 'archiver';
import type { IFile } from '../interfaces/file.interface';

@Injectable()
export class CloudinaryService implements OnModuleInit {
  [x: string]: any;
	private expiresIn: number;

	constructor(private readonly configService: ConfigService) {
		this.expiresIn = 3600; // 1 hour
	}

	onModuleInit() {
		cloudinary.config({
			cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
			api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
			api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
		});
	}

	async uploadFile(file: IFile, folder: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder,
					resource_type: 'auto',
				},
				(error, result) => {
					if (error) {
						console.error('Failed to upload file:', error);
						return reject(new Error(`Failed to upload file: ${error.message}`));
					}

					if (result && result.secure_url) {
						resolve(result.secure_url);
					} else {
						reject(new Error('Upload failed, no secure URL returned.'));
					}
				},
			);

			const bufferStream = new PassThrough();
			bufferStream.end(file.buffer);
			bufferStream.pipe(uploadStream);
		});
	}

	async deleteFile(publicId: string): Promise<void> {
		try {
			await cloudinary.uploader.destroy(publicId);
		} catch (error) {
			console.error('Failed to delete file:', error);
			throw new Error(`Failed to delete file: ${error.message}`);
		}
	}

	async getDownloadLink(publicId: string): Promise<string> {
		try {
			const url = cloudinary.url(publicId, { secure: true });
			return url;
		} catch (error) {
			console.error('Failed to generate download link:', error);
			throw new Error(`Failed to generate download link: ${error.message}`);
		}
	}

	async uploadFileFromPath(filePath: string, folder: string): Promise<string> {
		if (!fs.existsSync(filePath)) {
			throw new Error('File does not exist on the server');
		}

		try {
			const response = await cloudinary.uploader.upload(filePath, {
				folder,
				resource_type: 'auto',
			});

			return response.secure_url;
		} catch (error) {
			console.error('Failed to upload file from path:', error);
			throw new Error(`Failed to upload file from path: ${error.message}`);
		}
	}

	async downloadMultipleFiles(publicIds: string[]): Promise<PassThrough> {
		const archive = archiver('zip', { zlib: { level: 5 } });
		const passthrough = new PassThrough();

		archive.on('error', (err) => {
			console.error('Archive error:', err);
			passthrough.destroy(err);
		});

		archive.pipe(passthrough);

		for (const publicId of publicIds) {
			try {
				const url = cloudinary.url(publicId, { secure: true });
				const response = await fetch(url);
				if (response.ok) {
					const filename = path.basename(publicId);
					archive.append(response.body as unknown as NodeJS.ReadableStream, {
						name: filename,
					});
				}
			} catch (error) {
				console.error(`Failed to fetch file ${publicId}:`, error);
			}
		}

		archive.finalize();

		return passthrough;
	}
}
