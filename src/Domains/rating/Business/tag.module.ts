import { Module } from '@nestjs/common';
import { RatingService } from './tag.service';
import { RatingController } from '../Presentation/HTTP/rating.controller';

@Module({
  providers: [RatingService],
  controllers: [RatingController]
})
export class TagModule {}
