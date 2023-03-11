import { IsNumber } from 'class-validator';

export class AddTagDto {
    @IsNumber()
    tag: number;
}