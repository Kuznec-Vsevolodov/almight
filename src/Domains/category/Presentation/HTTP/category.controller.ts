import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from '../../Business/category.service';
import { CreateCategoryDto } from '../Dto/create-category.dto';
import { FindCategoryDto } from '../Dto/find-category.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) { }

    @Post("/")
    async create(@Body() dto: CreateCategoryDto) {
        return await this.categoryService.create(dto);
    }

    @Post("/find-by-name")
    async findByName(@Body() dto: FindCategoryDto) {
        return await this.categoryService.findByName(dto);
    }

    @Get("/:id")
    async getById(@Body() id) {
        return await this.categoryService.getById(id);
    }
}
