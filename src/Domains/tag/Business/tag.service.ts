import { Injectable } from '@nestjs/common';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from '../Presentation/Dto/create-tag.dto';
import { FindByNameDto } from '../dto/find-by-name.dto';
import { FindByTagTypeDto } from '../dto/find-by-type.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { Like } from 'typeorm';
import { TagWriter } from './Writer/tag.writer';

@Injectable()
export class TagService {

    constructor(
        private tagWriter: TagWriter
    ){}

    async create(dto: CreateTagDto) {
        return await this.tagWriter.create(dto);
    }
}
