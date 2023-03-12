import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../Infrastructure/Repository/category.repository'; 
import { FindCategoryDto } from '../../Presentation/Dto/find-category.dto';

@Injectable()
export class CategoryReader {

    constructor(
        private categoryRepository: CategoryRepository
    ) { }

    async getById(id) {
        return await this.categoryRepository.getById(id);
    }

    async findByName(dto: FindCategoryDto) {
        return await this.categoryRepository.findByName(dto);
    }

}