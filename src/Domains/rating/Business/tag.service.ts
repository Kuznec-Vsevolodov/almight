import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from '../Presentation/Dto/create-rating.dto';
import { RatingWriter } from './Writer/rating.writer';

@Injectable()
export class RatingService {

    constructor(
        private tagWriter: RatingWriter
    ){}

    async create(dto: CreateRatingDto) {
        return await this.tagWriter.create(dto);
    }
}
