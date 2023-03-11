import { Injectable } from '@nestjs/common';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { FindByNameDto } from './dto/find-by-name.dto';
import { FindByTagTypeDto } from './dto/find-by-type.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Like } from 'typeorm';

@Injectable()
export class TagService {

    async create(dto: CreateTagDto): Promise<Tag> {
        const tag = new Tag();

        tag.name = dto.name;
        tag.type = dto.type;

        return tag.save();
    }

    async update(dto: UpdateTagDto, id) {
        const tag = Tag.getRepository();
        const currentTagData = await Tag.findOne({
            where: { id }
        });

        return tag.save({
            ...currentTagData,
            ...dto
        })
    }

    async delete(id) {
        const tag = Tag.getRepository();
        return await tag.createQueryBuilder()
            .delete()
            .from('tags')
            .where('id = :id', { id: id })
            .execute();
    }

    async getByType(type: string) {
        return await Tag.getRepository()
            .createQueryBuilder('tags')
            .select(['tags.type', 'tags.name', 'tags.id'])
            .where('type = :type', { type: type })
            .orderBy('name')
            .getMany();
    }

    async findByName(dto: FindByNameDto) {
        const tags = await Tag.getRepository()
            .createQueryBuilder('tags')
            .select(['tags.type', 'tags.name', 'tags.id'])
            .where("tags.name like '%' || :name || '%'", { name: dto.name })
            .getRawMany();

        return tags;
    }
}
