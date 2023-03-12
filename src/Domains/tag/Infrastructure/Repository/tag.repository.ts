import { Injectable } from "@nestjs/common/decorators";
import { Tag } from "../Models/tag.entity";
import { TagDto } from "../../Business/Dto/tag.dto";

@Injectable()
export class TagRepository{

    private tag = Tag.getRepository();

    async create(creationDto: TagDto) {
        return Tag.create({...creationDto}).save();
    }
}