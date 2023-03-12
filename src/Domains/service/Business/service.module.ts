import { Module } from '@nestjs/common';
import { FileService } from '../../file/Busines/file.service';
import { PhotoService } from '../../photo/Busines/photo.service';
import { TagService } from '../../tag/Business/tag.service';
import { ServiceController } from '../Presentation/HTTP/service.controller';
import { ServiceService } from './service.service';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, FileService, PhotoService, TagService]
})
export class ServiceModule { }
