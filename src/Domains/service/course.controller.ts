import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors, Request, UseGuards, NotFoundException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { USER_IS_NOT_AUTHOR } from './constants/course.constants';
import { CourseService } from './course.service';
import { AddCategoriesDto } from './dto/add-categories.dto';
import { AddCourseLessonDto } from './dto/add-lesson.dto';
import { AddCourseReviewDto } from './dto/add-review.dto';
import { AddTagsDto } from './dto/add-tags.dto';
import { AddToFavoritsDto } from './dto/add-to-favorits.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { FindByCategoryDto } from './dto/find-by-category.dto';
import { FindByTagDto } from './dto/find-by-tag.dto';
import { FindByUserCategoriesDto } from './dto/find-by-user-categories.dto';
import { FindCourseDto } from './dto/find-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CourseController {
    constructor(private readonly courseService: CourseService) { }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'preview', maxCount: 1 }
    ]))
    async create(@Body() dto: CreateCourseDto, @UploadedFiles() file, @Request() req) {
        const { preview } = file;
        return this.courseService.create(dto, preview[0], req.user);
    }

    @Get('/')
    async getAll(@Query('skip') skip: number) {
        return this.courseService.getAll(skip);
    }

    @Get('/:id')
    async getOne(@Param('id') id: number) {
        return this.courseService.getOne(id);
    }

    @Get("/:id/lessons")
    async getLessons(@Param('id') id: number) {
        return this.courseService.getLessons(id);
    }

    @Get(":id/reviews")
    async getReviews(@Param('id') id: number, @Query('skip') skip: number) {
        return this.courseService.getReviews(id, skip);
    }

    @Post(':id/add-review')
    async addReview(@Body() dto: AddCourseReviewDto, @Param('id') id: number) {
        return this.courseService.addReview(dto, id);
    }

    @Patch(":id/")
    async update(@Body() dto: UpdateCourseDto, @Param('id') id: number, @Request() req) {
        if (await this.courseService.checkAuthor(req.user, id)) {
            return this.courseService.update(dto, id);
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)
    }

    @Patch(":id/preview-photo")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'preview', maxCount: 1 }
    ]))
    async updatePreview(@Param('id') id: number, @UploadedFiles() files, @Request() req) {
        if (await this.courseService.checkAuthor(req.user, id)) {
            const { preview } = files;
            return this.courseService.updatePreviewPhoto(preview[0], id)
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)
    }

    @Delete(':id')
    async delete(@Param('id') id: number, @Request() req) {
        if (await this.courseService.checkAuthor(req.user, id)) {
            return this.courseService.delete(id);
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)
    }

    @Post(':id/add-to-favorits')
    async addToFavorits(@Param('id') id: number, @Request() req) {
        return this.courseService.addToFavorits(req.user, id);
    }

    @Post(':id/delete-from-favorits')
    async deleteFromFavorits(@Param('id') id: number, @Request() req) {
        return this.courseService.deleteFromFavorits(req.user, id);
    }

    @Post("/find-by-name")
    async findByName(@Body() dto: FindCourseDto) {
        return this.courseService.findByName(dto);
    }

    @Post('/find-by-category')
    async findByCategory(@Body() dto: FindByCategoryDto, @Query('skip') skip: number) {
        return this.courseService.findByCategory(dto, skip);
    }

    @Post(":id/add-categories")
    async addCategories(@Body() dto: AddCategoriesDto, @Param('id') id: number, @Request() req) {
        if (await this.courseService.checkAuthor(req.user, id)) {
            return this.courseService.addCategories(dto, id);
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)
    }

    @Post(":id/add-tags")
    async addTags(@Body() dto: AddTagsDto, @Param('id') id: number, @Request() req) {
        if (await this.courseService.checkAuthor(req.user, id)) {
            return this.courseService.addTags(dto, id);
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)

    }

    @Post('/find-by-categories')
    async findByCategories(@Body() dto: FindByUserCategoriesDto, @Query('skip') skip: number) {
        return this.courseService.findByUserCategories(dto, skip);
    }

    @Post("/find-by-tag")
    async findByTag(@Body() dto: FindByTagDto, @Query('skip') skip: number) {
        return this.courseService.findByTag(dto, skip);
    }

    @Post(":id/add-lesson")
    async addLesson(@Body() dto: AddCourseLessonDto, @Param('id') id: number, @Request() req) {
        if (await this.courseService.checkAuthor(req.user, id)) {
            return this.courseService.addLesson(dto, id);
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)
    }

    @Delete("/:id/lessons/:lesson_id")
    async deleteLesson(@Param('lesson_id') lesson_id: number, @Param('id') id: number, @Request() req) {
        if (await this.courseService.checkAuthor(req.user, id)) {
            return this.courseService.deleteLesson(lesson_id);
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)
    }

    @Post(":id/buy")
    async addToCourse(@Param('id') id: number, @Request() req) {
        return this.courseService.buyCourse(req.user, id);
    }
}
