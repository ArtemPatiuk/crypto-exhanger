import { ConfigService } from '@nestjs/config';
import { FileStorage, FileStorageLocal, FileStorageS3 } from '@getlarge/nestjs-tools-file-storage';

export const fileStorageConfig = (configService: ConfigService): FileStorage => {
	const env = configService.get('NODE_ENV');
	const maxSize = configService.get<number>('UPLOAD_MAX_SIZE', 15728640);

	//For Local uploads
	// if (env === 'development') {
	// 	return new FileStorageLocal({
	// 		storagePath: './uploads',
	// 		maxPayloadSize: maxSize,
	// 	});
	// }

	return new FileStorageS3({
		maxPayloadSize: maxSize,
		bucket: configService.get('S3_BUCKET'),
		region: configService.get('S3_REGION'),
		endpoint: configService.get('S3_ENDPOINT'),
		forcePathStyle: true,
		credentials: {
			accessKeyId: configService.get('S3_ACCESS_KEY'),
			secretAccessKey: configService.get('S3_SECRET_KEY'),
		},
	});
};