import { IsNumber } from "class-validator";

export class AddCourseLessonDto {

    @IsNumber()
    post: number;

}