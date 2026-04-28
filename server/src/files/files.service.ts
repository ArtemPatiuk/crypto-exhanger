import { FileStorageService } from '@getlarge/nestjs-tools-file-storage';
import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private readonly fileStorageService: FileStorageService,
  ) { }
  async saveImage(file: Express.Multer.File) {
    try {
      const fileName = `${uuidv4()}.webp`;

      const processedBuffer = await (sharp as any)(file.buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 80 })
        .toBuffer();

      await this.fileStorageService.uploadFile({
        filePath: fileName,
        content: processedBuffer,
      });

      this.logger.log(`File uploaded successfully: ${fileName}`);

      return {
        fileName,
        url: fileName,
        mimetype: 'image/webp',
        size: processedBuffer.length,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.stack : 'Unknown error';
      this.logger.error('Error while processing image', errorMessage);
      throw new Error('Failed to process and upload image');
    }
  }

  // Метод для удаления (пригодится позже)
  async deleteFile(filePath: string): Promise<boolean> {
    return this.fileStorageService.deleteFile({ filePath });
  }
}