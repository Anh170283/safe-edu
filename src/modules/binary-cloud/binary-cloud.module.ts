import { Module } from '@nestjs/common';
import { BinaryCloudController } from './binary-cloud.controller';
import { GeneratorService } from 'src/services/generator.service';
import { CloudinaryService } from 'src/services/binary-cloud.service';

@Module({
	controllers: [BinaryCloudController],
	providers: [GeneratorService, CloudinaryService],
	exports: [GeneratorService, CloudinaryService],
})
export class BinaryCloudModule {}
