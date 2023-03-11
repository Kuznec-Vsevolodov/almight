import { Module } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { PhotoService } from '../photo/photo.service';
import { TagService } from '../tag/tag.service';
import { MarathonController } from './marathon.controller';
import { MarathonService } from './marathon.service';

@Module({
  controllers: [MarathonController],
  providers: [MarathonService, FileService, PhotoService, TagService]
})
export class MarathonModule { }
