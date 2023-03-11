import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors, Request, NotFoundException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { USER_IS_NOT_AUTHOR } from './constants/post.constants';
import { AddCategoriesDto } from './dto/add-categories.dto';
import { AddTagsDto } from './dto/add-tags.dto';
import { AddToAlbumDto } from './dto/add-to-album.dto';
import { CheckLikeDto } from './dto/check.like.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { FindByCategoryDto } from './dto/find-by-category.dto';
import { FindByTagDto } from './dto/find-by-tag.dto';
import { FindByUserCategoriesDto } from './dto/find-by-user-categories.dto';
import { FindPostDto } from './dto/find-post.dto';
import { CreateLikeDto } from './dto/like-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post('/create')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'photos', maxCount: 3 },
        { name: 'preview', maxCount: 1 },
        { name: 'videos', maxCount: 3 },
        { name: 'docs', maxCount: 10 },
    ]))
    async create(@Body() dto: CreatePostDto, @UploadedFiles() files, @Request() req) {
        const { photos, preview, videos, docs } = files;
        return this.postService.create(dto, preview[0], videos, photos, docs, req.user);
    }

    @Get('/')
    async getAllSimple(@Query() query) {
        return this.postService.getAllSimplePosts(query.skip);
    }

    @Get('/pro-videos/')
    async getProVideos(@Query() query) {
        return this.postService.getAllProVideoPosts(query.skip);
    }

    @Get('/pro-videos/:id')
    async getOneProVideo(@Param('id') id: number) {
        return this.postService.getOneProVideoPost(id)
    }

    @Get('/:id')
    async getOneSimple(@Param('id') id: number) {
        return this.postService.getOneSimplePost(id);
    }

    @Patch(':id/update/')
    async update(@Body() dto: UpdatePostDto, @Param('id') id: number, @Request() req) {
        if (await this.postService.checkAuthor(req.user, id)) {
            return this.postService.update(dto, id)
        }
        throw new NotFoundException(USER_IS_NOT_AUTHOR);
    }

    @Patch(':id/update/preview/')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'preview', maxCount: 1 }
    ]))
    async updatePreview(@Param('id') id: number, @UploadedFiles() files, @Request() req) {
        if (await this.postService.checkAuthor(req.user, id)) {
            const { preview } = files
            return this.postService.updatePreviewPhoto(preview[0], id)
        }
        throw new NotFoundException(USER_IS_NOT_AUTHOR);
    }

    @Patch(':id/update/videos/')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'videos', maxCount: 3 }
    ]))
    async updateVideo(@Param('id') id: number, @UploadedFiles() files, @Request() req) {
        if (await this.postService.checkAuthor(req.user, id)) {
            const { videos } = files
            return this.postService.updateVideo(videos, id)
        }
        throw new NotFoundException(USER_IS_NOT_AUTHOR);
    }

    @Patch(':id/update/photos/')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'photos', maxCount: 3 }
    ]))
    async updatePhotos(@Param('id') id: number, @UploadedFiles() files, @Request() req) {
        if (await this.postService.checkAuthor(req.user, id)) {
            const { photos } = files
            return this.postService.updatePhotos(photos, id)
        }

        throw new NotFoundException(USER_IS_NOT_AUTHOR);
    }

    @Patch(':id/update/docs/')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'docs', maxCount: 10 }
    ]))
    async updateDocs(@Param('id') id: number, @UploadedFiles() files, @Request() req) {
        if (await this.postService.checkAuthor(req.user, id)) {
            const { docs } = files
            return this.postService.updateDocs(docs, id)
        }
        throw new NotFoundException(USER_IS_NOT_AUTHOR);
    }

    @Delete(":id")
    async delete(@Param('id') id: number, @Request() req) {
        if (await this.postService.checkAuthor(req.user, id)) {
            return this.postService.delete(id);
        }
        throw new NotFoundException(USER_IS_NOT_AUTHOR);
    }

    @Post('/:id/comments/')
    async createComment(@Body() dto: CreateCommentDto, @Param('id') id: number) {
        return this.postService.createComment(dto, id);
    }

    @Delete("/:post_id/comments/:id")
    async deleteComment(@Param('id') id: number) {
        return this.postService.deleteComment(id);
    }

    @Post('/:post_id/comments/:id/reply')
    async createCommentReply(@Body() dto: CreateCommentDto, @Param('id') id: number) {
        return this.postService.createCommentReply(dto, id);
    }

    @Delete("/:post_id/comments/:comment_id/reply/:id")
    async deleteCommentReply(@Param('id') id: number) {
        return this.postService.deleteCommentReply(id);
    }

    @Get(":id/comments")
    async getComments(@Param('id') id: number, @Query() query) {
        return this.postService.getComments(id, query.skip);
    }

    @Get(":post_id/comments/:id")
    async getCommentReplies(@Param('id') id: number, @Query() query) {
        return this.postService.getCommentReplies(id, query.skip);
    }


    @Post('/:id/like')
    async likePost(@Request() req, @Param('id') id: number) {
        return this.postService.likePost(req.user, id);
    }

    @Post('/:id/comments/:id/like')
    async likeComment(@Body() dto: CreateLikeDto, @Param('id') id: number) {
        return this.postService.likeComment(dto, id);
    }

    @Post('/:post_id/comments/:id/check-like')
    async checkCommentLike(@Request() req, @Param('id') id: number) {
        return this.postService.checkUserLikeOnComment(req.user, id);
    }

    @Post('/:post_id/comments/:comment_id/replies/:id/like')
    async likeReplyComment(@Request() req, @Param('id') id: number) {
        return this.postService.likeCommentReply(req.user, id);
    }

    @Post('/:post_id/comments/:comment_id/replies/:id/check-like')
    async checkCommentReplyLike(@Request() req, @Param('id') id: number) {
        return this.postService.checkUserLikeOnCommentReply(req.user, id);
    }

    @Post('/:post_id/comments/:id/delete-like')
    async deleteLikeComment(@Request() req, @Param('id') id: number) {
        return this.postService.deleteCommentLike(req.user, id);
    }

    @Post('/:id/comments/:comment_id/replies/:id/delete-like')
    async deleteCommentReplyLike(@Request() req, @Param('id') id: number) {
        return this.postService.deleteCommentReplyLike(req.user, id);
    }

    @Post('/:id/delete-like')
    async deleteLike(@Request() req, @Param('id') id: number) {
        return this.postService.deletePostLike(req.user, id);
    }

    @Post('/:id/dislike')
    async dislikePost(@Request() req, @Param('id') id: number) {
        return this.postService.dislikePost(req.user, id);
    }

    @Post('/:id/delete-dislike')
    async deleteDislike(@Request() req, @Param('id') id: number) {
        return this.postService.deletePostDislike(req.user, id);
    }

    @Post('/:id/add-to-album')
    async addToAlbum(@Body() dto: AddToAlbumDto, @Param('id') id: number) {
        return this.postService.addToAlbum(dto, id);
    }

    @Post('/:id/delete-from-album')
    async deleteFromAlbum(@Body() dto: AddToAlbumDto, @Param('id') id: number) {
        return this.postService.deleteFromAlbum(dto, id)
    }

    @Post("/:id/check-user-like")
    async checkUserLike(@Request() req, @Param('id') id: number) {
        return this.postService.checkUserLikeOnPost(req.user, id);
    }

    @Post("/:id/check-user-dislike")
    async checkUserDislike(@Request() req, @Param('id') id: number) {
        return this.postService.checkUserDislikeOnPost(req.user, id);
    }

    @Post("/find-by-name")
    async findByName(@Body() dto: FindPostDto) {
        return this.postService.findByName(dto);
    }

    @Post('/find-by-category')
    async findSimpleByCategory(@Body() dto: FindByCategoryDto, @Query() query) {
        return this.postService.findSimpleByCategory(dto, query.skip);
    }

    @Post('/pro-videos/find-by-category')
    async findProVideoByCategory(@Body() dto: FindByCategoryDto, @Query() query) {
        return this.postService.findProVideoByCategory(dto, query.skip);
    }

    @Post(":id/add-categories")
    async addCategories(@Body() dto: AddCategoriesDto, @Param('id') id: number, @Request() req) {
        if (await this.postService.checkAuthor(req.user, id)) {
            return this.postService.addCategories(dto, id);
        }
        throw new NotFoundException(USER_IS_NOT_AUTHOR);
    }

    @Post(":id/add-tags")
    async addTags(@Body() dto: AddTagsDto, @Param('id') id: number, @Request() req) {
        if (await this.postService.checkAuthor(req.user, id)) {
            return this.postService.addTags(dto, id);
        }
        throw new NotFoundException(USER_IS_NOT_AUTHOR);
    }

    @Post("/find-by-categories")
    async findSimpleByUserCategories(@Body() dto: FindByUserCategoriesDto, @Query() query) {
        return this.postService.findSimpleByUserCategories(dto, query.skip);
    }

    @Post("/find-by-tag")
    async findSimpleByTag(@Body() dto: FindByTagDto, @Query() query) {
        return this.postService.findSimpleByTag(dto, query.skip);
    }

    @Post("/pro-videos/find-by-tag")
    async findProVideoByTag(@Body() dto: FindByTagDto, @Query() query) {
        return this.postService.findProVideoByTag(dto, query.skip);
    }

    @Post("/pro-videos/find-by-categories")
    async findProVideoByUserCategories(@Body() dto: FindByUserCategoriesDto, @Query() query) {
        return this.postService.findProVideoByUserCategories(dto, query.skip);
    }

}
