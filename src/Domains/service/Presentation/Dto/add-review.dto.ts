import { IsNumber, IsString } from "class-validator";

export class AddCourseReviewDto{
   
    @IsNumber()
    user: number;

    @IsString()
    text: string;

    @IsNumber()
    score: number;
}