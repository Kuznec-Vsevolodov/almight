import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { path } from 'app-root-path';
import { FileService } from '../file/file.service';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: `${path}/uploads`,
    serveRoot: '/static'
  })],
  controllers: [PhotoController],
  providers: [PhotoService, FileService]
})
export class PhotoModule { }
