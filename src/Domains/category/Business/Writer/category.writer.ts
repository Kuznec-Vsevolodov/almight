import { Injectable } from '@nestjs/common';
import { CategoryDto } from '../Dto/category.dto';
import { CreateCategoryDto } from '../../Presentation/Dto/create-category.dto';
import { CategoryRepository } from '../../Infrastructure/Repository/category.repository';

@Injectable()
export class CategoryWriter {

    constructor(
        private categoryRepository: CategoryRepository
    ) { }

    public async create(presentationDto: CreateCategoryDto) {
        const category = new CategoryDto();

        category.name = presentationDto.name;

        return await this.categoryRepository.create(category);
    }

}