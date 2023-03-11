import { Module } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { PhotoService } from '../photo/photo.service';
import { TagService } from '../tag/tag.service';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, FileService, PhotoService, TagService]
})
export class CourseModule { }
