import { IsNumber } from 'class-validator';

export class FindByCategoryDto {
    @IsNumber()
    category: number;
}