import { 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-image')
  // 'file' — это имя ключа, который мы будем отправлять из Postman или React
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Максимальный размер (возьмем 5МБ для примера)
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 15 }),
          // Разрешаем только картинки
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    // Вызываем наш метод, который жмет в WebP и отправляет в MinIO
    return this.filesService.saveImage(file);
  }
}