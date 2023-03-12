import { IsString } from 'class-validator';

export class FindCourseDto {
    @IsString()
    name: string;
}