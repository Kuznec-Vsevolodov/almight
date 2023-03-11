import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AddTagDto } from './dto/add-tag.dto';
import { AddCategoriesDto } from './dto/add-categories.dto';
import { AddToCourseDto } from './dto/add-to-course.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { SubscribeUserDto } from './dto/subscribe-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @Post('/create')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'avatar' }
    ]))
    async create(@Body() dto: CreateUserDto, @UploadedFiles() file) {
        const { avatar } = file;
        return this.userService.create(dto, avatar[0]);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/subscribe')
    async subscribe(@Body() dto: SubscribeUserDto, @Request() req) {
        return this.userService.subscribe(dto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/subscribe-prime')
    async subscribePrime(@Body() dto: SubscribeUserDto, @Request() req) {
        return this.userService.primeSubscribe(dto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/albums/')
    async getAlbums(@Request() req) {
        return this.userService.getAlbums(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/bought-courses/")
    async getBoughtCourses(@Request() req) {
        return this.userService.getBoughtCourses(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/albums/')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'preview_photo', maxCount: 1 }
    ]))
    async createAlbum(@Body() dto: CreateAlbumDto, @UploadedFiles() file, @Request() req) {
        const { preview_photo } = file;
        return this.userService.createAlbum(dto, preview_photo[0], req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/update/')
    async update(@Body() dto: CreateUserDto, @Request() req) {
        return this.userService.update(dto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/update/avatar/')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'avatar' }
    ]))
    async updateAvatar(@UploadedFiles() file, @Request() req) {
        const { avatar } = file;
        return this.userService.updateAvatar(avatar[0], req.user)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/albums/:id')
    async updateAlbum(@Body() dto: CreateAlbumDto, @Param('id') id: number) {
        return this.userService.updateAlbum(dto, id)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/albums/:id/preview/')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'preview' }
    ]))
    async updateAlbumPreview(@UploadedFiles() file, @Param('id') id: number) {
        const { preview } = file;
        return this.userService.updateAlbumPreviewPhoto(preview[0], id)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll() {
        return this.userService.getAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOne(@Param('id') id: number) {
        return this.userService.getOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/friends/')
    async getFriends(@Param('id') id: number) {
        return this.userService.getFriends(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/subscriptions/')
    async getSubscriptions(@Param('id') id: number) {
        return this.userService.getSubscriptions(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/subscribers/')
    async getSubscribers(@Param('id') id: number) {
        return this.userService.getSubscribers(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/albums/:id')
    async getAlbum(@Param('id') id: number) {
        return this.userService.getAlbum(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/albums/:id/posts')
    async getAlbumPosts(@Param('id') id: number) {
        return this.userService.getAlbumPosts(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/favorites/courses")
    async getFavoriteCourses(@Request() req) {
        return this.userService.getFavoriteCourses(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/:id/courses")
    async getCourses(@Param('id') id: number) {
        return this.userService.getCourses(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/:id/posts")
    async getPosts(@Param('id') id: number) {
        return this.userService.getPosts(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/:id/pro-videos")
    async getProVideos(@Param('id') id: number) {
        return this.userService.getProVideos(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/:id/categories")
    async getCategories(@Param('id') id: number) {
        return this.userService.getCategories(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/categories/users")
    async findByUserCategories(@Request() req) {
        return this.userService.findByCategories(req.user);
    }



    @UseGuards(JwtAuthGuard)
    @Delete()
    async delete(@Request() req) {
        return this.userService.delete(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/subscribe/:id')
    async deleteSubscription(@Param('id') id: number) {
        return this.userService.cancelSubscription(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/subscribe-prime/:id')
    async deletePrimeSubscription(@Param('id') id: number) {
        return this.userService.cancelPrimeSubscription(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/find-by-name")
    async findByName(@Body() dto: FindUserDto) {
        return this.userService.findByName(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/add-categories")
    async addCategories(@Body() dto: AddCategoriesDto, @Param('id') id: number, @Request() req) {
        return this.userService.addCategories(dto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/add-tag")
    async addTag(@Body() dto: AddTagDto, @Request() req) {
        return this.userService.addTag(dto, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post(":id/check-tag")
    async checkTag(@Body() dto: AddTagDto, @Param('id') id: number) {
        return this.userService.checkTag(dto, id);
    }
}
