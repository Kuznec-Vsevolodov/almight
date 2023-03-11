import { IsBoolean, IsString } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    name: string;

    parent: number | null;

    @IsBoolean()
    is_parent: boolean;
}