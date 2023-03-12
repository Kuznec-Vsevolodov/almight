import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors, Request, UseGuards, NotFoundException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../auth/guards/jwt.guard';
import { USER_IS_NOT_AUTHOR } from './Busines/Constants/service.constants';
import { ServiceService } from '../../Business/service.service';
import { AddCategoriesDto } from '../Dto/add-categories.dto';
import { AddserviceLessonDto } from '../Dto/add-lesson.dto';
import { AddserviceReviewDto } from '../Dto/add-review.dto';
import { AddTagsDto } from '../Dto/add-tags.dto';
import { CategoryDto, CreateServiceDto, TagDto } from '../Dto/create-service.dto';
import { FindByCategoryDto } from '../Dto/find-by-category.dto';
import { FindByTagDto } from '../Dto/find-by-tag.dto';
import { FindByUserCategoriesDto } from '../Dto/find-by-user-categories.dto';
import { FindserviceDto } from '../Dto/find-service.dto';
import { UpdateserviceDto } from '../Dto/update-service.dto';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'preview', maxCount: 1 }
    ]))
    async create(@Body() dto: CreateServiceDto, @UploadedFiles() file, @Request() req) {
        const { preview } = file;
        return this.serviceService.create(dto, preview[0]);
    }

    @Get('/')
    async getAll() {
        return this.serviceService.getServices();
    }

    @Get('/:id')
    async getOne(@Param('id') id: number) {
        return this.serviceService.getById(id);
    }

    @Post(":id/add-categories")
    async addCategories(@Body() dto: CategoryDto[], @Param('id') id: number) {
        return this.serviceService.addCategories(dto, id);
    }

    @Post(":id/add-tags")
    async addTags(@Body() dto: TagDto[], @Param('id') id: number) {
        return this.serviceService.addTags(dto, id);

    }
}
