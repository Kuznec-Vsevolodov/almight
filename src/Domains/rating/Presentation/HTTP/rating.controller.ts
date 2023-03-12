import { Body, Controller, Post } from '@nestjs/common';
import { CreateRatingDto } from '../Dto/create-rating.dto';
import { RatingService } from '../../Business/tag.service';

@Controller('ratings')
export class RatingController {
    constructor(private readonly ratingService: RatingService) { }

    @Post("/")
    async create(@Body() dto: CreateRatingDto) {
        return this.ratingService.create(dto);
    }
}
