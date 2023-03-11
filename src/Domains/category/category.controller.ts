import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { AddTagsDto } from './dto/add-tags.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) { }

    @Get('/parents')
    async getParents() {
        return this.categoryService.getAllParents();
    }

    @Get(':id/children/')
    async getByParent(@Param('id') id: number) {
        return this.categoryService.getByParent(id);
    }

    @Get(':id/parent/')
    async getParent(@Param('id') id: number) {
        return this.categoryService.getParent(id);
    }

    @Post("/")
    async create(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto);
    }

    @Post("/find-by-name")
    async findByName(@Body() dto: FindCategoryDto) {
        return this.categoryService.findByName(dto);
    }

    @Patch(":id/")
    async update(@Body() dto: UpdateCategoryDto, @Param('id') id: number) {
        return this.categoryService.update(dto, id);
    }

    @Delete(":id/")
    async delete(@Param('id') id: number) {
        return this.categoryService.delete(id);
    }

    @Post(":id/add-tags")
    async addTags(@Body() dto: AddTagsDto, @Param('id') id: number) {
        return this.categoryService.addTags(dto, id);
    }
}
