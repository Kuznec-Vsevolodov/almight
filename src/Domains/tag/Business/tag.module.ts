import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from '../Presentation/HTTP/tag.controller';

@Module({
  providers: [TagService],
  controllers: [TagController]
})
export class TagModule {}
