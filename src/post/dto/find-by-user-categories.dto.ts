import { IsNumber } from 'class-validator';

export class FindByUserCategoriesDto {
    @IsNumber()
    user: number;
}