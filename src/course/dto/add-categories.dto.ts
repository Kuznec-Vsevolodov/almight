import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator'

class CategoryDto {
    @IsNumber()
    category: number
}

export class AddCategoriesDto {
    @IsArray()
    @ValidateNested()
    @Type(() => CategoryDto)
    categories: CategoryDto[];
}