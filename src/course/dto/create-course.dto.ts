import { IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsString()
    description: string;

}