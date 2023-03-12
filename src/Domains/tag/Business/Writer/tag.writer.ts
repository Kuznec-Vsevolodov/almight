import { Injectable } from '@nestjs/common';
import { TagDto } from '../Dto/tag.dto';
import { CreateTagDto } from '../../Presentation/Dto/create-tag.dto';
import { TagRepository } from '../../Infrastructure/Repository/tag.repository';

@Injectable()
export class TagWriter {

    constructor(
        private tagRepository: TagRepository
    ) { }

    public async create(presentationDto: CreateTagDto) {
        const tag = new TagDto(); 

        tag.name = presentationDto.name;

        return await this.tagRepository.create(tag);
    }

}