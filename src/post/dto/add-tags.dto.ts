import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

class TagDto {
    @IsNumber()
    tag: number;
}

export class AddTagsDto {
    @IsArray()
    @ValidateNested()
    @Type(() => TagDto)
    tags: TagDto[];
}