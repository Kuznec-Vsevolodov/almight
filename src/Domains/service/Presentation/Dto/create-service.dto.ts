import { IsArray, IsNumber, IsString } from "class-validator";

export class CategoryDto {
    @IsNumber()
    category: number;
}

export class TagDto {
    @IsString()
    tag: string;
}

export class CreateServiceDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    author: number;

    @IsString()
    price_position_name: string;

    @IsNumber()
    average_rating: number;

    @IsArray()
    categories: CategoryDto[];

    @IsArray()
    tags: TagDto[];

    @IsString()
    description: string;

}