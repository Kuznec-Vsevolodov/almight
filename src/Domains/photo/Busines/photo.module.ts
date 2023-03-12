import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PhotoService } from './photo.service';
import { path } from 'app-root-path';
import { FileService } from '../../file/Busines/file.service';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: `${path}/uploads`,
    serveRoot: '/static'
  })],
  providers: [PhotoService, FileService]
})
export class PhotoModule { }
