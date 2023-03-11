import { Controller, UseInterceptors, Post, Body, UploadedFiles, Get, Patch, Param, Delete, Query, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { CreateMarathonDto } from './dto/create-marathon.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MarathonService } from './marathon.service';
import { UpdateMarathonDto } from './dto/update-marathon.dto';
import { CheckUserPositionDto } from './dto/check-user-position.dto';
import { AddUserDto } from './dto/add-user.dto';
import { RateUserDto } from './dto/rate-user.dto';
import { AddStagesDto } from './dto/add-stages.dto';
import { AddPostToStageDto } from './dto/add-post-to-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { AddToFavoritsDto } from './dto/add-to-favorits.dto';
import { FindMarathonDto } from './dto/find-marathon.dto';
import { AddCategoriesDto } from './dto/add-categories.dto';
import { FindByUserCategoriesDto } from './dto/find-by-user-categories.dto';
import { FindByCategoryDto } from './dto/find-by-category.dto';
import { AddTagsDto } from './dto/add-tags.dto';
import { FindByTagDto } from './dto/find-by-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { USER_IS_NOT_AUTHOR } from './constants/marathon.constants';

@Controller('marathons')
@UseGuards(JwtAuthGuard)
export class MarathonController {

    constructor(private readonly marathonService: MarathonService) { }

    @Post('/')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'preview', maxCount: 1 },
    ]))
    async create(@Body() dto: CreateMarathonDto, @UploadedFiles() files, @Request() req) {
        const { preview } = files;
        return this.marathonService.create(dto, preview[0], req.user);
    }

    @Get(':id/user-position')
    async checkUserPosition(@Param('id') id: number, @Request() req) {
        return this.marathonService.getUserPosition(req.user, id)
    }

    @Post(":id/add-user")
    async addUser(@Param('id') id: number, @Request() req) {
        return this.marathonService.AddUser(req.user, id);
    }

    @Post(":id/rate-user/:stage_id")
    async rateUser(@Body() dto: RateUserDto, @Param('stage_id') stage_id: number, @Request() req) {
        return this.marathonService.rateUser(dto, stage_id, req.user);
    }

    @Post(":id/add-stages")
    async addStages(@Body() dto: AddStagesDto, @Param('id') id: number, @Request() req) {
        if (await this.marathonService.checkAuthor(req.user, id)) {
            return this.marathonService.addStages(dto, id)
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)
    }

    @Post(":id/stages/:stage_id/add-post")
    async addPostToStage(@Body() dto: AddPostToStageDto, @Param('stage_id') stage_id: number, @Param('id') id: number, @Request() req) {
        if (await this.marathonService.checkAuthor(req.user, id)) {
            return this.marathonService.addPostToStage(dto, stage_id)
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)
    }

    @Get(":id/check-user")
    async checkUser(@Param('id') id: number, @Request() req) {
        return this.marathonService.checkUser(req.user, id);
    }

    @Get(":id/stages/:stage_id/check-user-rate")
    async checkUserRate(@Param('stage_id') stage_id: number, @Request() req) {
        return this.marathonService.checkUserRate(req.user, stage_id);
    }

    @Post(":id/add-categories")
    async addCategories(@Body() dto: AddCategoriesDto, @Param('id') id: number, @Request() req) {
        if (await this.marathonService.checkAuthor(req.user, id)) {
            return this.marathonService.addCategories(dto, id);
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)
    }

    @Post(":id/add-tags")
    async addTags(@Body() dto: AddTagsDto, @Param('id') id: number, @Request() req) {
        if (await this.marathonService.checkAuthor(req.user, id)) {
            return this.marathonService.addTags(dto, id);
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)
    }

    @Post('/find-by-category')
    async findByCategory(@Body() dto: FindByCategoryDto, @Query() query) {
        return this.marathonService.findByCategory(dto, query.skip);
    }

    @Get('/find-by-categories')
    async findByCategories(@Query() query, @Request() req) {
        return this.marathonService.findByUserCategories(req.user, query.skip);
    }

    @Get("/find-by-tag")
    async findByTag(@Query() query, @Request() req) {
        return this.marathonService.findByTag(req.user, query.skip);
    }

    @Get('/')
    async getAll(@Query() query) {
        return this.marathonService.getAll(query.skip);
    }

    @Get(':id/winner')
    async getWinner(@Param('id') id: number) {
        return this.marathonService.getWinner(id);
    }

    @Get(':id/users-top')
    async getUsersTop(@Param('id') id: number, @Query() query) {
        return this.marathonService.getUsersTop(id, query.skip);
    }

    @Get(':id/stages')
    async getStages(@Param('id') id: number) {
        return this.marathonService.getStages(id);
    }

    @Get(':id/stages/ended')
    async getEndedStagesQuantity(@Param('id') id: number) {
        return this.marathonService.getQuantityOfEndedStages(id);
    }

    @Get(':id/stages/:stage_id/posts')
    async getStagePosts(@Param('stage_id') stage_id: number, @Query() query) {
        return this.marathonService.getStagePosts(stage_id, query.skip);
    }

    @Patch(":id/")
    async update(@Body() dto: UpdateMarathonDto, @Param('id') id: number) {
        return this.marathonService.update(dto, id);
    }

    @Patch(":id/stages/:stage_id")
    async updateStage(@Body() dto: UpdateStageDto, @Param('stage_id') stage_id: number, @Param('id') id: number, @Request() req) {
        if (await this.marathonService.checkAuthor(req.user, id)) {
            return this.marathonService.updateStage(dto, stage_id);
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)
    }

    @Patch(":id/preview-photo")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'preview', maxCount: 1 }
    ]))
    async updatePreview(@Param('id') id: number, @UploadedFiles() files, @Request() req) {
        if (await this.marathonService.checkAuthor(req.user, id)) {
            const { preview } = files;
            return this.marathonService.updatePreviewPhoto(preview[0], id)
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)
    }

    @Delete(":id/stages/:stage_id/posts/:post_id")
    async deletePostFromStage(@Param('post_id') post_id: number, @Param('id') id: number, @Request() req) {
        if (await this.marathonService.checkAuthor(req.user, id)) {
            return this.marathonService.deletePostFromStage(post_id)
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)

    }

    @Delete(":id/")
    async delete(@Param('id') id: number, @Request() req) {
        if (await this.marathonService.checkAuthor(req.user, id)) {
            return this.marathonService.delete(id)
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR)
    }

    @Post(':id/add-to-favorits')
    async addToFavorits(@Param('id') id: number, @Request() req) {
        return this.marathonService.addToFavorits(req.user, id);
    }

    @Post(':id/subscribe-on-marathon')
    async subscribeOnMarathon(@Param('id') id: number, @Request() req) {
        return this.marathonService.subscribeOnMarathon(req.user, id);
    }

    @Post(':id/delete-from-favorits')
    async deleteFromFavorits(@Param('id') id: number, @Request() req) {
        return this.marathonService.deleteFromFavorits(req.user, id);
    }

    @Post("/find-by-name")
    async findByName(@Body() dto: FindMarathonDto) {
        return this.marathonService.findByName(dto);
    }

}
