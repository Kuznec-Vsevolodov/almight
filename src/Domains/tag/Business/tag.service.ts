import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../Presentation/Dto/create-tag.dto';
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
