import { Body, Controller, Post } from '@nestjs/common';
import { CreateTagDto } from '../Dto/create-tag.dto';
import { TagService } from '../../Business/tag.service';

@Controller('tags')
export class TagController {
    constructor(private readonly tagService: TagService) { }

    @Post("/")
    async create(@Body() dto: CreateTagDto) {
        return this.tagService.create(dto);
    }
}
