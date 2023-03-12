import { Injectable } from "@nestjs/common/decorators";
import { Like } from "typeorm";
import { CategoryDto } from "../../Business/Dto/category.dto";
import { FindCategoryDto } from "../../Presentation/Dto/find-category.dto";
import { Category } from "../Models/category.entity";

@Injectable()
export class CategoryRepository{

    private category = Category.getRepository();

    async create(creationDto: CategoryDto) {
        return Category.create({...creationDto}).save();
    }

    async findByName(dto: FindCategoryDto) {
        return await Category.find({
            where: { name: Like('%' + dto.name + '%') }
        })
    }

    async getById(id) {
        return await Category.findOne({
            where: { id }
        })
    }
}