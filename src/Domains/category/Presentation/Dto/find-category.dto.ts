import { IsString } from 'class-validator';

export class FindCategoryDto {
    @IsString()
    name: string;
}