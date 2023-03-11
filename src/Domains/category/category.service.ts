import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { Like } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryTag } from '../entities/category_tag.entity';
import { Tag } from '../entities/tag.entity';
import { AddTagsDto } from './dto/add-tags.dto';

@Injectable()
export class CategoryService {

    async create(dto: CreateCategoryDto): Promise<Category> {
        const category = new Category();

        category.name = dto.name;
        category.isParent = dto.is_parent;
        category.parent = dto.parent != null ? await Category.findOne({ where: { id: dto.parent } }) : null;

        return category.save();
    }

    async update(dto: UpdateCategoryDto, id) {
        const category = Category.getRepository();
        const currentCategoryData = await category.findOne({
            where: { id }
        });

        return category.save({
            ...currentCategoryData,
            ...dto
        })
    }

    async createTag(tagData, category) {
        const tag = new CategoryTag();

        tag.category = category;
        tag.tag = await Tag.findOne({ where: { id: tagData.tag } });

        return tag.save();
    }

    async addTags(dto: AddTagsDto, id) {
        const tags: CategoryTag[] = [];

        const category = await Category.findOne({ where: { id } });

        for (const tag of dto.tags) {
            const savedTag = await this.createTag(tag, category)
            tags.push(savedTag);
        }

        return tags;
    }

    async delete(id) {
        const category = Category.getRepository();
        return await category.createQueryBuilder()
            .delete()
            .from('categories')
            .where('id = :id', { id: id })
            .execute();
    }

    async findByName(dto: FindCategoryDto): Promise<Category[]> {
        return await Category.find({
            where: { name: Like('%' + dto.name + '%') }
        })
    }

    async getByParent(id) {
        return await Category.getRepository().createQueryBuilder('categories').where('parent = :id', { id }).getMany();
    }

    async getParent(id) {
        const category = await Category.getRepository().createQueryBuilder('categories').where('id = :id', { id }).getRawOne();
        return await Category.findOne({ where: { id: category.parent } })
    }

    async getAllParents() {
        return await Category.getRepository()
            .createQueryBuilder('categories')
            .where('is_parent = true')
            .orderBy('name')
            .getMany();
    }

}
