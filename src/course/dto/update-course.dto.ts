import { IsNumber, IsString } from "class-validator";

export class UpdateCourseDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsString()
    description: string;

}