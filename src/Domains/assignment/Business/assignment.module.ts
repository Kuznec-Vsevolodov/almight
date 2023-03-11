import { Module } from '@nestjs/common';
import { FileService } from '../../file/file.service';
import { PhotoService } from '../../photo/photo.service';
import { TagService } from '../../tag/tag.service';
import { PostController } from '../Presentation/HTTP/post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService, FileService, PhotoService, TagService]
})
export class PostModule { }
