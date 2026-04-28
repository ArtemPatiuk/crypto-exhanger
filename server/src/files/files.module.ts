import { Global, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileStorageModule,FileStorageService } from '@getlarge/nestjs-tools-file-storage';
import { ConfigService } from '@nestjs/config';
import { fileStorageConfig } from 'src/config/file-storage.config';

@Global()
@Module({
  imports: [
    FileStorageModule.forRootAsync({
      inject: [ConfigService],
      useFactory: fileStorageConfig,
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService, FileStorageModule],
})
export class FilesModule {}
