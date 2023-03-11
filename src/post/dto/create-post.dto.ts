import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
    @IsString()
    name: string;

    @IsNumber()
    views: number;

    @IsString()
    description: string;

    @IsBoolean()
    is_pro: boolean;

    @IsBoolean()
    is_course: boolean;

    @IsBoolean()
    is_premium: boolean;
}