import { IsNumber } from 'class-validator';

export class AddToCourseDto {

    @IsNumber()
    course: number;
}