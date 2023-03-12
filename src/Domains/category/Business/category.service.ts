import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../Presentation/Dto/create-category.dto';
import { FindCategoryDto } from '../Presentation/Dto/find-category.dto';
import { CategoryWriter } from './Writer/category.writer';
import { CategoryReader } from './Reader/category.reader';

@Injectable()
export class CategoryService {
    constructor(
        private categoryWriter: CategoryWriter,
        private categoryReader: CategoryReader
    ){}

    async create(presentationDto: CreateCategoryDto){
        return await this.categoryWriter.create(presentationDto);
    }

    async getById(id){
        return await this.categoryReader.getById(id);
    }

    async findByName(dto: FindCategoryDto){
        return await this.categoryReader.findByName(dto);
    }


}
