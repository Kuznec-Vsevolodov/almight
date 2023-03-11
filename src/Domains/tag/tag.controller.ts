import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { FindByTagTypeDto } from './dto/find-by-type.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
    constructor(private readonly tagService: TagService) { }

    @Post("/")
    async create(@Body() dto: CreateTagDto) {
        return this.tagService.create(dto);
    }

    @Get("/get-by-type")
    async getByType(@Query() query) {
        return this.tagService.getByType(query.type);
    }

    @Patch(":id/")
    async update(@Body() dto: UpdateTagDto, @Param('id') id: number) {
        return this.tagService.update(dto, id);
    }

    @Delete(":id/")
    async delete(@Param('id') id: number) {
        return this.tagService.delete(id);
    }
}
